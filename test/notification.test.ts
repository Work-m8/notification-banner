import { parseNotifications } from "../src/notification";

describe("parseNotifications", () => {
  describe("With From Date", () => {
    const from: Date = new Date();

    describe("With To Date", () => {
      test("without front-matter", () => {
        const content = ["This is the notification"];

        const want = ["This is the notification"];

        const got = parseNotifications(content);

        expect(got).toStrictEqual(want);
      });

      test("with front-matter", () => {
        const to: number = new Date().getTime() + 5000;

        const content = [
          `---
from: ${from.getTime()}
to: ${to}
---

This is the notification`,
        ];

        const want = ["This is the notification"];

        const got = parseNotifications(content);

        expect(got).toStrictEqual(want);
      });

      test("In the future", () => {
        const from: number = new Date().getTime() + 5000;

        const content = [
          `---
from: ${from}
to: ${from}
---

This is the notification`,
        ];

        const want: string[] = [];

        const got = parseNotifications(content);

        expect(got).toStrictEqual(want);
      });

      test("In the past", () => {
        const to: number = new Date().getTime() - 5000;

        const content = [
          `---
from: 0
to: ${to}
---

This is the notification`,
        ];

        const want: string[] = [];

        const got = parseNotifications(content);

        expect(got).toStrictEqual(want);
      });
    });
  });
});
