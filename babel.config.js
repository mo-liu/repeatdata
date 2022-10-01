/*
 * @Descripttion: 
 * @version: 
 * @Author: mqq
 * @Date: 2022-09-10 19:21:11
 * @LastEditors: mqq
 */
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      "import",
      {
        libraryName: 'element-plus',
        customStyleName: (name) => {
          return `element-plus/theme-chalk/${name}.css`;
        },
      },
    ],
  ],
}