const path = require(`path`);

module.exports = {
  mode: `development`, // режим сборки
  entry: `./src/main.js`, // точка входа приложения
  output: {// настройка выходного файла
    filename: `bundle.js`,
    path: path.join(__dirname, `public`)
  },
  devtool: `source-map`, // подключаем sourcemap
  devServer: {
    contentBase: path.join(__dirname, `public`), // где искать сборку
    watchContentBase: true
  }
};
