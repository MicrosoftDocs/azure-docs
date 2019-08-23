---
title: Develop U-SQL user-defined operators (UDOs) in Azure Data Lake Analytics
description: Learn how to develop user-defined operators to be used and reused in Azure Data Lake Analytics jobs.
services: data-lake-analytics
ms.service: data-lake-analytics
author: saveenr
ms.author: saveenr

ms.reviewer: jasonwhowell
ms.assetid: e5189e4e-9438-46d1-8686-ed4836bf3356
ms.topic: conceptual
ms.date: 12/05/2016
---
# Develop U-SQL user-defined operators (UDOs)
This article describes how to develop user-defined operators to process data in a U-SQL job.

## Define and use a user-defined operator in U-SQL
**To create and submit a U-SQL job**

1. From the Visual Studio select **File > New > Project > U-SQL Project**.
2. Click **OK**. Visual Studio creates a solution with a Script.usql file.
3. From **Solution Explorer**, expand Script.usql, and then double-click **Script.usql.cs**.
4. Paste the following code into the file:

        using Microsoft.Analytics.Interfaces;
        using System.Collections.Generic;

        namespace USQL_UDO
        {
            public class CountryName : IProcessor
            {
                private static IDictionary<string, string> CountryTranslation = new Dictionary<string, string>
                {
                    {
                        "Deutschland", "Germany"
                    },
                    {
                        "Suisse", "Switzerland"
                    },
                    {
                        "UK", "United Kingdom"
                    },
                    {
                        "USA", "United States of America"
                    },
                    {
                        "中国", "PR China"
                    }
                };

                public override IRow Process(IRow input, IUpdatableRow output)
                {

                    string UserID = input.Get<string>("UserID");
                    string Name = input.Get<string>("Name");
                    string Address = input.Get<string>("Address");
                    string City = input.Get<string>("City");
                    string State = input.Get<string>("State");
                    string PostalCode = input.Get<string>("PostalCode");
                    string Country = input.Get<string>("Country");
                    string Phone = input.Get<string>("Phone");

                    if (CountryTranslation.Keys.Contains(Country))
                    {
                        Country = CountryTranslation[Country];
                    }
                    output.Set<string>(0, UserID);
                    output.Set<string>(1, Name);
                    output.Set<string>(2, Address);
                    output.Set<string>(3, City);
                    output.Set<string>(4, State);
                    output.Set<string>(5, PostalCode);
                    output.Set<string>(6, Country);
                    output.Set<string>(7, Phone);

                    return output.AsReadOnly();
                }
            }
        }
6. Open **Script.usql**, and paste the following U-SQL script:

        @drivers =
            EXTRACT UserID      string,
                    Name        string,
                    Address     string,
                    City        string,
                    State       string,
                    PostalCode  string,
                    Country     string,
                    Phone       string
            FROM "/Samples/Data/AmbulanceData/Drivers.txt"
            USING Extractors.Tsv(Encoding.Unicode);

        @drivers_CountryName =
            PROCESS @drivers
            PRODUCE UserID string,
                    Name string,
                    Address string,
                    City string,
                    State string,
                    PostalCode string,
                    Country string,
                    Phone string
            USING new USQL_UDO.CountryName();    

        OUTPUT @drivers_CountryName
            TO "/Samples/Outputs/Drivers.csv"
            USING Outputters.Csv(Encoding.Unicode);
7. Specify the Data Lake Analytics account, Database, and Schema.
8. From **Solution Explorer**, right-click **Script.usql**, and then click **Build Script**.
9. From **Solution Explorer**, right-click **Script.usql**, and then click **Submit Script**.
10. If you haven't connected to your Azure subscription, you will be prompted to enter your Azure account credentials.
11. Click **Submit**. Submission results and job link are available in the Results window when the submission is completed.
12. Click the **Refresh** button to see the latest job status and refresh the screen.

**To see the output**

1. From **Server Explorer**, expand **Azure**, expand **Data Lake Analytics**, expand your Data Lake Analytics account, expand **Storage Accounts**, right-click the Default Storage, and then click **Explorer**.
2. Expand Samples, expand Outputs, and then double-click **Drivers.csv**.

## See also
* [Extending U-SQL Expressions with User-Code](/u-sql/concepts/extending-u-sql-expressions-with-user-code)
* [Use Data Lake Tools for Visual Studio for developing U-SQL applications](data-lake-analytics-data-lake-tools-get-started.md)
