export function getValueAtPath(obj: any, path: string[]): any {
  if (path.length === 0) {
    return obj;
  }
  if (Array.from(Object.keys(obj)).includes(path[0])) {
    return getValueAtPath(obj[path[0]], path.slice(1));
  }
  return null;
}
