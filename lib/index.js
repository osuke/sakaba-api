const puppeteer = require('puppeteer');

const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.bs-tbs.co.jp/sakaba/map/index.html');
  const item = await page.$$('.kihon1, .kihon5');
  const data = {
    items: []
  };
  let area = '';

  for (let i = 0; i < item.length; i++) {
    const thisClass = await (await item[i].getProperty('className')).jsonValue();

    if (thisClass === 'kihon1') {
      area = await (await item[i].getProperty('textContent')).jsonValue();
    } else {
      const url = await (await item[i].getProperty('href')).jsonValue();
      const urlArr = url.split('/');
      const id = urlArr[urlArr.length - 1].split('.html')[0];
      const info = {
        id,
        area,
        name: await (await item[i].getProperty('textContent')).jsonValue(),
        url: url
      };
      data.items.push(info);
    }
  }

  fs.writeFile(`dist/res.json`, JSON.stringify(data), function (err) {
    console.log(err);
  });
  await browser.close();
})();