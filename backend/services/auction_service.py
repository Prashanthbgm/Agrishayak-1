from datetime import datetime, timedelta

# In-memory storage (same as your old backend, but clean)
auctions_db = {}
bids_db = {}
auction_counter = 1


def create_auction(data):
    global auction_counter

    required = ["crop_name", "quantity", "base_price"]
    for r in required:
        if not data.get(r):
            return {"error": f"{r} is required"}

    auction_id = f"AUC_{auction_counter}"
    auction_counter += 1

    auction = {
        "auction_id": auction_id,
        "crop_name": data["crop_name"],
        "quantity": float(data["quantity"]),
        "base_price": float(data["base_price"]),
        "seller_name": data.get("seller_name", "Anonymous"),
        "seller_contact": data.get("seller_contact", ""),
        "district": data.get("district", ""),
        "market": data.get("market", ""),
        "created_at": datetime.now().isoformat(),
        "end_time": (datetime.now() + timedelta(hours=24)).isoformat(),
        "status": "active",
        "highest_bid": float(data["base_price"]),
        "bid_count": 0,
        "accepted_bid": None
    }

    auctions_db[auction_id] = auction
    bids_db[auction_id] = []

    return {"success": True, "auction": auction}


def get_active_auctions():
    result = []

    for auc in auctions_db.values():
        if auc["status"] == "active":
            auc_copy = auc.copy()
            auc_copy["bid_count"] = len(bids_db.get(auc["auction_id"], []))
            result.append(auc_copy)

    return result


def place_bid(auction_id, data):
    if auction_id not in auctions_db:
        return {"error": "Auction not found"}

    auction = auctions_db[auction_id]

    if auction["status"] != "active":
        return {"error": "Auction closed"}

    bid_amount = float(data.get("bid_amount", 0))
    bidder_name = data.get("bidder_name", "Anonymous")
    bidder_contact = data.get("bidder_contact", "")

    if bid_amount <= auction["highest_bid"]:
        return {"error": "Bid must be higher than current highest bid"}

    # Time check
    if datetime.now() > datetime.fromisoformat(auction["end_time"]):
        auction["status"] = "closed"
        return {"error": "Auction ended"}

    bid = {
        "bidder_name": bidder_name,
        "bidder_contact": bidder_contact,
        "bid_amount": bid_amount,
        "time": datetime.now().isoformat()
    }

    bids_db[auction_id].append(bid)
    auction["highest_bid"] = bid_amount
    auction["bid_count"] = len(bids_db[auction_id])

    return {"success": True, "bid": bid, "auction": auction}


def get_admin_connections():
    connections = []

    for auction_id, auction in auctions_db.items():
        bids = bids_db.get(auction_id, [])
        if not bids:
            continue

        highest_bid = max(bids, key=lambda x: x["bid_amount"])

        connections.append({
            "auction_id": auction_id,
            "crop_name": auction["crop_name"],
            "seller_name": auction["seller_name"],
            "seller_contact": auction["seller_contact"],
            "highest_bidder": highest_bid["bidder_name"],
            "bidder_contact": highest_bid["bidder_contact"],
            "highest_bid": highest_bid["bid_amount"]
        })
        
def accept_highest_bid(auction_id):
    if auction_id not in auctions_db:
        return {"error": "Auction not found"}

    auction = auctions_db[auction_id]
    bids = bids_db.get(auction_id, [])

    if not bids:
        return {"error": "No bids to accept"}

    if auction["status"] != "active":
        return {"error": "Auction not active"}

    highest_bid = max(bids, key=lambda x: x["bid_amount"])

    auction["accepted_bid"] = highest_bid
    auction["status"] = "waiting_payment"

    return {
        "success": True,
        "message": "Bid accepted. Waiting for payment.",
        "auction_id": auction_id,
        "amount_to_pay": highest_bid["bid_amount"],
        "bidder": highest_bid["bidder_name"]
    }

    return connections
