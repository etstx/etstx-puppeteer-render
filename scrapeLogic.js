const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res) => {
	// Launch the browser and open a new blank page
	const browser = await puppeteer.launch(
		args: [
			"--disable-setuid-sandbox",
			"--no-sandbox",
			"--single-process",
			"--no-zygote",
		],
		executablePath:
			process.env.NODE_ENV === 'production'
			? process.env.PUPPETEER_EXECUTABLE_PATH
			: puppeteer.executablePath(),
	);
	try {
		const page = await browser.newPage();
    // throw new Error("This is a test error while running Puppeteer on the server.");

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
		const fullTitle = await textSelector?.evaluate((el) => el.textContent);

		// Print the full title.
		const logStatement = `Puppeteer scrapeLogic is running on the server. The title of the blog post is ${fullTitle}.`;
		console.log(logStatement);
		res.send(logStatement);
	} catch (e) {
		console.error(e);
    res.send(`An error occurred while running Puppeteer on the server. ${e}`);
	} finally {
		await browser.close();
	}
};

module.exports = { scrapeLogic };
