import { Router } from "express";
import ProductManager from "../dao/fs/ProductManager.js";

const manager = new ProductManager("productos.json");
const router = Router();

router.get("/", (req, res) => {
	const { limit } = req.query;
	const products = manager.getProducts();
	res.json({
		status: "success",
		code: "200",
		payload: limit ? products.slice(0, limit) : products,
	});
});

router.post("/", (req, res) => {
	const { title, description, price, code, stock } = req.body;

	if (!title || !description || !price || !code || !stock) {
		res.status(404).json({ status: "fail", code: 400, error: "Missing fields" });
		return;
	}

	const result = manager.addProduct(req.body);
	res.status(201).json({ status: "created", code: 201, payload: result });
});

router.get("/:pid", (req, res) => {
	const pid = req.params;
	const product = manager.getProductById(pid);
	if (!product) {
		res.status(404).json({ status: "fail", code: 404, error: "Product not found" });
		return;
	}
	res.json({ status: "success", code: 200, payload: product });
});

router.put("/:pid", (req, res) => {
	const pid = req.params;
	const update = req.body;
	const authorized = Object.keys(update).every((prop) => {
		["title", "description", "price", "code", "stock", "category", "thumbnails"].includes(prop);
	});

	if (!authorized) {
		res.status(404).json({ status: "fail", code: 400, error: "Something prop is invalid" });
		return;
	}

	const updated = manager.updateProduct(pid, req.body);
	if (!updated) {
		res.status(404).json({ status: "fail", code: 404, error: "Product not found" });
		return;
	}

	res.json({ status: "success", code: 200, payload: updated });
});

router.get("/:pid", (req, res) => {
	const pid = req.params;
	const deleted = manager.deleteProduct(pid);
	if (!deleted) {
		res.status(404).json({ status: "fail", code: 404, error: "Product not found" });
		return;
	}
	res.json({ status: "success", code: 200, payload: deleted });
});

export default router;
