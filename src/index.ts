const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.bs-tbs.co.jp/sakaba/map/index.html');
  const item = await page.$$('.kihon1, .kihon5')
  const data = { items:[] };

  let area = '';

  for (let i = 0; i < item.length; i++) {
    const thisClass = await (await item[i].getProperty('className')).jsonValue();

    if (thisClass === 'kihon1') {
      area = await (await item[i].getProperty('textContent')).jsonValue()
    } else {
      const info = {
        area,
        name: await (await item[i].getProperty('textContent')).jsonValue(),
        url: await (await item[i].getProperty('href')).jsonValue()
      };
      data.items.push(info);
      //console.log(await (await item[i].getProperty('textContent')).jsonValue())
      //console.log(await (await item[i].getProperty('href')).jsonValue());
    }
  }

  fs.writeFile(`dist/res.json`, JSON.stringify(data), function (err) {
    console.log(err);
  });

  await browser.close();
})();
