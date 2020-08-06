import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({ casesType, active, title, cases, total, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${
        active && casesType === "cases" && "infoBox--selected--cases"
      } 
      ${
        active && casesType === "recovered" && "infoBox--selected--recovered"
      } ${active && casesType === "deaths" && "infoBox--selected--deaths"}`}
    >
      <CardContent>
        {/* { title } */}
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>
        {/* {number of cases} */}
        <h2
          className={`infoBox__cases ${
            casesType === "cases" && "infoBox__cases--cases"
          }
        ${casesType === "recovered" && "infoBox__cases--recovered"} ${
            casesType === "cases" && "infoBox__cases--death"
          }`}
        >
          {cases}
        </h2>
        {/* {total} */}
        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
