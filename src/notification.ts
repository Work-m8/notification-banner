import fm from "front-matter";

type Attributes = {
  from?: string;
  to?: string;
};

export const parseNotifications = (contents: string[]): string[] => {
  return contents
    .filter((c) => {
      const frontMatter = fm<Attributes>(c);

      const from: number = new Date(
        frontMatter.attributes.from || ""
      ).getTime();
      const to: number = new Date(frontMatter.attributes.to || "").getTime();
      const now = new Date().getTime();

      const isAfter = isNaN(from) ? true : from < now;
      const isBefore = isNaN(to) ? true : to > now;

      return isBefore && isAfter;
    })
    .map((c) => fm(c).body);
};
