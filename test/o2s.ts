import { BrunoQuery } from "./../dist";

export function normal() {
  let a = new BrunoQuery().addArrayFilterGroup([
    {
      or: true,
      filters: [
        {
          key: "author",
          value: "Optimus",
          operator: "sw",
        },
        {
          key: "age",
          value: 18,
          operator: "gt",
        },
      ],
    },
    {
      // or: false,
      filters: [
        {
          key: "status",
          value: ["HOAT_DONG", "DA_DONG"],
          operator: "in",
        },
      ],
    },
  ]).addSort({
    key: "name",
    direction: "ASC",
  }).setOptional([{
    name: "John",
    age: 30,
  }]);
  console.log(JSON.stringify(a.toObject(), null, 2));
  console.log(a.toQueryString());
}

export function optional() {
  let a = new BrunoQuery().setOptional({
    name: "John",
    age: 30,
  });
  console.log(JSON.stringify(a.toObject(), null, 2));
}

normal();
// optional();
