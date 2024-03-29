const MATCHER = /{{\s?([^{}\s]*)\s?}}/g;

export function interpolate(expr: string, params?: any): string {
  if (!params) {
    return expr;
  }

  return expr.replace(MATCHER, (substring: string, b: string) => {
    const r = getValue(params, b);
    return isDefined(r) ? r : substring;
  });
}

export function isDefined(value: any): boolean {
  return typeof value !== 'undefined' && value !== null;
}

function getValue(target: any, key: string): any {
  const keys = typeof key === 'string' ? key.split('.') : [key];
  key = '';
  do {
    key += keys.shift();
    if (
      isDefined(target) &&
      isDefined(target[key]) &&
      (typeof target[key] === 'object' || !keys.length)
    ) {
      target = target[key];
      key = '';
    } else if (!keys.length) {
      target = undefined;
    } else {
      key += '.';
    }
  } while (keys.length);

  return target;
}
