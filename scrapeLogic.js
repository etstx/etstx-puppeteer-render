const puppeteer = require("puppeteer");
require("dotenv").config();
const fs = require("fs");

const scrapeLogic = async (res, serverName, serverPort) => {
	// Determine the executable path
	const executablePath = process.env.NODE_ENV === "production" ? process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath() : puppeteer.executablePath();

	// Check if executable path exists only if it's explicitly set
	if (process.env.PUPPETEER_EXECUTABLE_PATH && !fs.existsSync(executablePath)) {
		throw new Error(`Tried to find the browser at the configured path (${executablePath}), but no executable was found.`);
	}

	// Launch the browser and open a new blank page
	const browser = await puppeteer.launch({
		args: ["--disable-setuid-sandbox", "--no-sandbox", "--single-process", "--no-zygote"],
		executablePath: executablePath,
	});

	try {
		const page = await browser.newPage();

		// Navigate the page to a URL.
		await page.goto("https://developer.chrome.com/");

		// Set screen size.
		await page.setViewport({ width: 1080, height: 1024 });

		// Type into search box.
		await page.locator(".devsite-search-field").fill("automate beyond recorder");

		// Wait and click on first result.
		await page.locator(".devsite-result-item-link").click();

		// Locate the full title with a unique string.
		const textSelector = await page.locator("text/Customize and automate").waitHandle();
		const fullTitle = await textSelector?.evaluate((el) => el.textContent?.trim());

		// Print the full title.
		const logStatement = `Puppeteer scrapeLogic.js is running on Port ${serverPort} on the ${serverName} Server. The title of the scraped blog post is "${fullTitle}."`;
		console.log(logStatement);
		res.send(logStatement);
	} catch (e) {
		console.error(e);
		res.send(`An error occurred while running Puppeteer on Port ${serverPort} on the ${serverName} Server. (${e})`);
	} finally {
		await browser.close();
	}
};

module.exports = { scrapeLogic };
