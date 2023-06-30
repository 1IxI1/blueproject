import { Cell, beginCell } from "ton-core";

const minBoc = beginCell().endCell().toBoc();
const minRef = beginCell().storeRef(Cell.EMPTY).endCell().toBoc();
const minBocSize = minBoc.length;
const minRefSize = minRef.length;
const refSize = minRefSize - minBocSize;
const depthLimitBytes = 132000;
export const bocWithSizeOf = (bytes: number) => {
    /* Create a boc with a size of bytes.
       Works approximately. Gives 1 byte more in 0.8% of cases.
     */
    if (bytes < minBocSize)
      throw new Error("Empty cell takes minimum " + minBocSize + " bytes");
    if (bytes > depthLimitBytes)
      throw new Error("Requested boc will have depth more than 1024");

    let root = beginCell();
    let len = root.endCell().toBoc().length;
    let left = bytes - len;
    while (left > 0) {
        if (root.availableBits <= refSize * 8) {
            if (left <= refSize) {
                while (len <= bytes && root.availableBits > 0) {
                    root.storeBit(0);
                    len = root.endCell().toBoc().length;
                } break;
            }
            root = beginCell().storeRef(root.asCell());
        } else {
            root.storeUint(0, 8);
        }
        len = root.endCell().toBoc().length;
        left = bytes - len;
    }
    return root.endCell();
}
