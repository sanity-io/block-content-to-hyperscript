declare module '@sanity/generate-help-url' {
  declare function generateHelpUrl(key: string): string
  export default generateHelpUrl
}

declare module '@sanity/image-url' {
  declare function urlBuilder(urlBuilderParams: {
    projectId: string
    dataset: any
    options?: any
  }): {
    image(node: any): any
  }

  export default urlBuilder
}
