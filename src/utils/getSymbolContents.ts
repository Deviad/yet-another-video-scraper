const getSymbolContents: (symbol: Symbol) => string = (symbol: Symbol) => {
  return symbol.toString().replace(/[Symbol()]/g, '');
};

export default getSymbolContents;
