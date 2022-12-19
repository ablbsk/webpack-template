const fs = require("fs")
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

function findHTMLPages() {
  const htmlPages = []

  fs.readdirSync("src/pages/").forEach(file => {
    htmlPages.push(new HtmlWebpackPlugin({
      filename: file,
      template: path.resolve(__dirname, `src/pages/${file}`),
      inject: "body"
    }))
  })

  return htmlPages
}

function includeStylesInMain() {
  return () => {
    const files = []

    fs.readdirSync(path.join(__dirname, "src/styles")).forEach(folderName => {
      if (!folderName.includes(".")) {
        fs.readdirSync(path.join(__dirname, `src/styles/${folderName}`)).forEach(item => {
          const value = item.slice(1, item.indexOf("."))
          files.push(`${folderName}/${value}`)
        })
      }
    })

    fs.writeFile(path.join(__dirname, "src/styles/main.scss"),
      files.map(item => `@import "${item}";`).join('\n'),
      (e) => console.log(e
        ? "Error: write dependencies in main.scss :" + e
        : "Complete write dependencies in main.scss"
      )
    )
  }
}

module.exports = {
  htmlPages: findHTMLPages(),
  includeStylesInMain: includeStylesInMain(),
}
