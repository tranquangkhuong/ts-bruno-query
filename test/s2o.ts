import { BrunoQuery } from '../dist';

export function stringToObject(): void {
  const query = "sort[0][key]=name&sort[0][direction]=ASC&filter_groups[0][or]=true&filter_groups[0][filters][0][key]=author&filter_groups[0][filters][0][value]=Optimus&filter_groups[0][filters][0][operator]=sw&filter_groups[0][filters][1][key]=age&filter_groups[0][filters][1][value]=18&filter_groups[0][filters][1][operator]=gt&filter_groups[1][filters][0][key]=status&filter_groups[1][filters][0][value][]=HOAT_DONG&filter_groups[1][filters][0][value][]=DA_DONG&filter_groups[1][filters][0][operator]=in&limit=15&page=1&name=John&age=30";
  const a = BrunoQuery.fromQueryString(query);
  console.log(JSON.stringify(a.toObject(), null, 2));
}

stringToObject();
