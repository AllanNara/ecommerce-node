import fs from "fs";
import { __dirname } from "../../utils.js";

export default class ProductManager {
	constructor(path) {
		this.path = __dirname + "dao/fs/DB/" + path;
		this.products = [];

		if (fs.existsSync(this.path)) {
			const json = fs.readFileSync(this.path, "utf-8");
			this.products = JSON.parse(json);
		} else fs.writeFileSync(this.path, "[]", "utf-8");
	}

	addProduct(product) {
		const { title, description, price, code, category, stock, thumbnails } =
			product;

		if (!title || !description || !price || !code || !stock) {
			console.error("Missing props");
			return null;
		}

		if (this.products.find((pr) => pr.code === code)) {
			console.error("Code alredy exists");
			return null;
		}

		const newProduct = {
			title,
			description,
			price,
			code,
			category,
			stock,
			thumbnails,
			status: true,
			id: this.products.length ? this.products[this.products.length - 1].id + 1 : 1,
		};

		this.products.push(newProduct);
		this.#writeFile();
		return newProduct;
	}

	getProducts() {
		return this.products;
	}

	getProductById(pid) {
		pid = Number(pid)
		const product = this.products.find((pr) => pr.id === pid);
		if (!product) console.error("Product with id " + pid + " not exists");
		return product;
	}

	updateProduct(pid, obj) {
		pid = Number(pid)
		const productIndex = this.products.findIndex((pr) => pr.id === pid);
		if (productIndex === -1) {
			console.error("Product with id " + pid + " not exists");
			return null;
		}

		this.products[productIndex] = { ...this.products[productIndex], ...obj };
		this.#writeFile();
		return this.products[productIndex];
	}

	deleteProduct(pid) {
		pid = Number(pid)
		const productIndex = this.products.findIndex((pr) => pr.id === pid);
		if (productIndex === -1) {
			console.error("Product with id " + pid + " not exists");
			return null;
		}
		this.products.splice(productIndex, 1);
		this.#writeFile();
		return true;
	}

	#writeFile() {
		try {
			const json = JSON.stringify(this.products, null, 2);
			fs.writeFileSync(this.path, json, "utf-8");
		} catch (error) {
			throw new Error("Fatal error: ", error);
		}
	}
}

