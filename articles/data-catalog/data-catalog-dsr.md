<properties
   pageTitle="Azure Data Catalog supported data sources | Microsoft Azure"
   description="Specification of the currently supported data sources."
   services="data-catalog"
   documentationCenter=""
   authors="trhabe"
   manager="jstrauss"
   editor=""
   tags=""/>
<tags
   ms.service="data-catalog"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-catalog"
   ms.date="01/15/2016"
   ms.author="trhabe"/>

# Azure Data Catalog supported data sources

Users of the Azure Data Catalog can publish metadata using a public API, a click-once registration tool, or by manually entering information directly to the Data Catalog web portal. The below grid summarizes all sources supported by the catalog today, and the publishing capabilities for each.  Also listed are the external data tools that each source can launch from our portal "open-in" experience. Further below is a second grid that has a more technical specification of each data sources connection properties.


## List of supported data sources

<table>

    <tr>
       <td><b>Data Source Object</b></td>
       <td><b>API</b></td>
       <td><b>Manual Entry</b></td>
       <td><b>Registration Tool</b></td>
       <td><b>Open-In Tools</b></td>
       <td><b>Notes</b></td>
    </tr>

    <tr>
      <td>Azure Data Lake Store Directory</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2></font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Azure Data Lake Store File</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2></font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Azure Storage Blob</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>PowerBI</font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Azure Storage Directory</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>PowerBI</font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Azure Storage Table</td>
      <td>✓</td>
      <td></td>
      <td></td>
      <td>
        <font size="2"></font>
      </td>
      <td>
        <font size="2"></font>
      </td>
    </tr>

    <tr>
      <td>HDFS Directory</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2></font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>HDFS File</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2></font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Hive Table</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>Excel</font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Hive View</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>Excel</font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>MySQL Table</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>Excel, PowerBI</font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>MySQL View</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>Excel, PowerBI</font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Oracle Database Table</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>Excel, PowerBI</font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Oracle Database View</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>Excel, PowerBI</font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Other (Generic Asset)</td>
      <td>✓</td>
      <td>✓</td>
      <td></td>
      <td><font size=2></font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>SQL Data Warehouse Table</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>Excel, PowerBI, SQL Server Data Tools</font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>SQL Data Warehouse View</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>Excel, PowerBI, SQL Server Data Tools</font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>SQL Server Analysis Services Dimension</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>Excel, PowerBI</font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>SQL Server Analysis Services KPI</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>Excel, PowerBI</font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>SQL Server Analysis Services Measure</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>Excel, PowerBI</font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>SQL Server Analysis Services Table</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>Excel, PowerBI</font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>SQL Server Reporting Services Report</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>Browser</font></td>
      <td><font size=2>Native mode servers only. SharePoint mode is not supported.</font></td>
    </tr>

    <tr>
      <td>SQL Server Table</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>Excel, PowerBI, SQL Server Data Tools</font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>SQL Server View</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>Excel, PowerBI, SQL Server Data Tools</font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Teradata Table</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>Excel</font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Teradata View</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>Excel</font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>SAP Hana View</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>PowerBI</font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Db2 Table</td>
      <td>✓</td>
      <td></td>
      <td></td>
      <td><font size=2></font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Db2 View</td>
      <td>✓</td>
      <td></td>
      <td></td>
      <td><font size=2></font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>File System File</td>
      <td>✓</td>
      <td></td>
      <td></td>
      <td><font size=2></font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Ftp Directory</td>
      <td>✓</td>
      <td></td>
      <td></td>
      <td><font size=2></font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Ftp File</td>
      <td>✓</td>
      <td></td>
      <td></td>
      <td><font size=2></font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Http Report</td>
      <td>✓</td>
      <td></td>
      <td></td>
      <td><font size=2></font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Http End Point</td>
      <td>✓</td>
      <td></td>
      <td></td>
      <td><font size=2></font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Http File</td>
      <td>✓</td>
      <td></td>
      <td></td>
      <td><font size=2></font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Odata Entity Set</td>
      <td>✓</td>
      <td></td>
      <td></td>
      <td><font size=2></font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Odata Function</td>
      <td>✓</td>
      <td></td>
      <td></td>
      <td><font size=2></font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Postgresql Table</td>
      <td>✓</td>
      <td></td>
      <td></td>
      <td><font size=2></font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Postgresql View</td>
      <td>✓</td>
      <td></td>
      <td></td>
      <td><font size=2></font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>SAP Hana View</td>
      <td>✓</td>
      <td></td>
      <td></td>
      <td><font size=2></font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td> Salesforce Object</td>
      <td>✓</td>
      <td></td>
      <td></td>
      <td><font size=2></font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>Sharepoint List </td>
      <td>✓</td>
      <td></td>
      <td></td>
      <td><font size=2></font></td>
      <td><font size=2></font></td>
    </tr>

</table>

If you need support for additional sources, please submit a feature request using the [Azure Data Catalog forum](http://go.microsoft.com/fwlink/?LinkID=616424&clcid=0x409).


<br>
<br>
## Data source reference specification
> [AZURE.NOTE] "DSL Structure" column in the table below only lists connection properties for "address" property bag which are used by Azure Data Catalog (i.e. "address" property bag can contain other connection properties of the data source which Azure Data Catalog persists, but does not use.)
<table>
    <tr>
       <td><b>Source Type</b></td>
       <td><b>Asset Type</b></td>
       <td><b>Object Type(s)</b></td>
       <td><b>DSL Structure<b></td>
    </tr>
    <tr>
      <td>Azure Data Lake Store</td>
      <td>Container</td>
      <td>Data Lake</td>
      <td>
        <font size=2>
            protocol: webhdfs
            <br>authentication: {basic, oauth}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>
    <tr>
      <td>Azure Data Lake Store</td>
      <td>Table</td>
      <td>Directory, File</td>
      <td>
        <font size=2>
            protocol: webhdfs
            <br>authentication: {basic, oauth}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>
    <tr>
      <td>Azure Storage</td>
      <td>Container</td>
      <td>Container</td>
      <td>
        <font size=2>
            protocol: azure-blobs
            <br>authentication: {azure-access-key}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; domain
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; account
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; container
        </font>
      </td>
    </tr>
    <tr>
      <td>Azure Storage</td>
      <td>Table</td>
      <td>Blob, Directory</td>
      <td>
        <font size=2>
            protocol: azure-blobs
            <br>authentication: {azure-access-key}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; domain
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; account
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; container
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; name
        </font>
      </td>
    </tr>
    <tr>
      <td>Azure Storage</td>
      <td>Container</td>
      <td>Container</td>
      <td>
        <font size=2>
            protocol: azure-tables
            <br>authentication: {azure-access-key}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; domain
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; account
        </font>
      </td>
    </tr>
    <tr>
      <td>Azure Storage</td>
      <td>Table</td>
      <td>Table</td>
      <td>
        <font size=2>
            protocol: azure-tables
            <br>authentication: {azure-access-key}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; domain
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; account
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; name
        </font>
      </td>
    </tr>
    <tr>
      <td>Cosmos</td>
      <td>Container</td>
      <td>Virtual Cluster</td>
      <td>
        <font size=2>
            protocol: cosmos
            <br>authentication: {basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>
    <tr>
      <td>Cosmos</td>
      <td>Table</td>
      <td>Stream, Stream Set, View</td>
      <td>
        <font size=2>
            protocol: cosmos
            <br>authentication: {basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>
    <tr>
      <td>DataZen</td>
      <td>Container</td>
      <td>Site</td>
      <td>
        <font size=2>
            protocol: http
            <br>authentication: {none, basic, windows, oauth}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>
    <tr>
      <td>DataZen</td>
      <td>Report</td>
      <td>Report, Dashboard</td>
      <td>
        <font size=2>
            protocol: http
            <br>authentication: {none, basic, windows, oauth}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>
    <tr>
      <td>Db2</td>
      <td>Container</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol: db2
            <br>authentication: {basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
        </font>
      </td>
    </tr>
    <tr>
      <td>Db2</td>
      <td>Table</td>
      <td>Table, View</td>
      <td>
        <font size=2>
            protocol: db2
            <br>authentication: {basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; schema
        </font>
      </td>
    </tr>
    <tr>
      <td>File System</td>
      <td>Table</td>
      <td>File</td>
      <td>
        <font size=2>
            protocol: file
            <br>authentication: {none, basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; path
        </font>
      </td>
    </tr>
    <tr>
      <td>Ftp</td>
      <td>Table</td>
      <td>Directory, File</td>
      <td>
        <font size=2>
            protocol: ftp
            <br>authentication: {none, basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>
    <tr>
      <td>Hadoop Distributed File System</td>
      <td>Container</td>
      <td>Cluster</td>
      <td>
        <font size=2>
            protocol: webhdfs
            <br>authentication: {basic, oauth}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>
    <tr>
      <td>Hadoop Distributed File System</td>
      <td>Table</td>
      <td>Directory, File</td>
      <td>
        <font size=2>
            protocol: webhdfs
            <br>authentication: {basic, oauth}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>
    <tr>
      <td>Hive</td>
      <td>Container</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol: hive
            <br>authentication: {hdinsight, basic, username, none}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>connectionProperties:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; serverProtocol: {hive2}
        </font>
      </td>
    </tr>
    <tr>
      <td>Hive</td>
      <td>Table</td>
      <td>Table, View</td>
      <td>
        <font size=2>
            protocol: hive
            <br>authentication: {hdinsight, basic, username, none}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
            <br>connectionProperties:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; serverProtocol: {hive2}
        </font>
      </td>
    </tr>
    <tr>
      <td>Http</td>
      <td>Container</td>
      <td>Site</td>
      <td>
        <font size=2>
            protocol: http
            <br>authentication: {none, basic, windows, oauth}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>
    <tr>
      <td>Http</td>
      <td>Report</td>
      <td>Report, Dashboard</td>
      <td>
        <font size=2>
            protocol: http
            <br>authentication: {none, basic, windows, oauth}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>
    <tr>
      <td>Http</td>
      <td>Table</td>
      <td>End Point, File</td>
      <td>
        <font size=2>
            protocol: http
            <br>authentication: {none, basic, windows, oauth}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>
    <tr>
      <td>MySQL</td>
      <td>Container</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol: mysql
            <br>authentication: {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
        </font>
      </td>
    </tr>
    <tr>
      <td>MySQL</td>
      <td>Table</td>
      <td>Table, View</td>
      <td>
        <font size=2>
            protocol: mysql
            <br>authentication: {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
        </font>
      </td>
    </tr>
    <tr>
      <td>Odata</td>
      <td>Container</td>
      <td>Entity Container</td>
      <td>
        <font size=2>
            protocol: odata
            <br>authentication: {none, basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>
    <tr>
      <td>Odata</td>
      <td>Table</td>
      <td>Entity Set, Function</td>
      <td>
        <font size=2>
            protocol: odata
            <br>authentication: {none, basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; resource
        </font>
      </td>
    </tr>
    <tr>
      <td>Oracle Database</td>
      <td>Container</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol: oracle
            <br>authentication: {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
        </font>
      </td>
    </tr>
    <tr>
      <td>Oracle Database</td>
      <td>Table</td>
      <td>Table, View</td>
      <td>
        <font size=2>
            protocol: oracle
            <br>authentication: {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; schema
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
        </font>
      </td>
    </tr>
    <tr>
      <td>Postgresql</td>
      <td>Container</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol: postgresql
            <br>authentication: {basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
        </font>
      </td>
    </tr>
    <tr>
      <td>Postgresql</td>
      <td>Table</td>
      <td>Table, View</td>
      <td>
        <font size=2>
            protocol: postgresql
            <br>authentication: {basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; schema
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
        </font>
      </td>
    </tr>
    <tr>
      <td>Power BI</td>
      <td>Container</td>
      <td>Site</td>
      <td>
        <font size=2>
            protocol: http
            <br>authentication: {none, basic, windows, oauth}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>
    <tr>
      <td>Power BI</td>
      <td>Report</td>
      <td>Report, Dashboard</td>
      <td>
        <font size=2>
            protocol: http
            <br>authentication: {none, basic, windows, oauth}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>
    <tr>
      <td>Salesforce</td>
      <td>Table</td>
      <td>Object</td>
      <td>
        <font size=2>
            protocol: salesforce-com
            <br>authentication: {basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; loginServer
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; class
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; itemName
        </font>
      </td>
    </tr>
    <tr>
      <td>SAP Hana</td>
      <td>Container</td>
      <td>Server</td>
      <td>
        <font size=2>
            protocol: sap-hana-sql
            <br>authentication: {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
        </font>
      </td>
    </tr>
    <tr>
      <td>SAP Hana</td>
      <td>Table</td>
      <td>View</td>
      <td>
        <font size=2>
            protocol: sap-hana-sql
            <br>authentication: {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; schema
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
        </font>
      </td>
    </tr>
    <tr>
      <td>SharePoint</td>
      <td>Table</td>
      <td>List</td>
      <td>
        <font size=2>
            protocol: sharepoint-list
            <br>authentication: {basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>
    <tr>
      <td>SQL Data Warehouse</td>
      <td>Command</td>
      <td>Stored Procedure</td>
      <td>
        <font size=2>
            protocol: tds
            <br>authentication: {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; schema
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
        </font>
      </td>
    </tr>
    <tr>
      <td>SQL Data Warehouse</td>
      <td>Container</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol: tds
          <br>authentication: {protocol, windows}
          <br>address:
          <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
          <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
        </font>
      </td>
    </tr>
    <tr>
      <td>SQL Data Warehouse</td>
      <td>Table</td>
      <td>Table, View</td>
      <td>
        <font size=2>
            protocol: tds
            <br>authentication: {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; schema
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
        </font>
      </td>
    </tr>
    <tr>
      <td>SQL Server</td>
      <td>Command</td>
      <td>Stored Procedure</td>
      <td>
        <font size=2>
            protocol: tds
            <br>authentication: {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; schema
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
        </font>
      </td>
    </tr>
    <tr>
      <td>SQL Server</td>
      <td>Container</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol: tds
            <br>authentication: {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
        </font>
      </td>
    </tr>
    <tr>
      <td>SQL Server</td>
      <td>Table</td>
      <td>Table, View, Table-valued Function</td>
      <td>
        <font size=2>
            protocol: tds
            <br>authentication: {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; schema
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
        </font>
      </td>
    </tr>
    <tr>
      <td>SQL Server Analysis Services Multidimensional</td>
      <td>Container</td>
      <td>Model</td>
      <td>
        <font size=2>
            protocol: analysis-services
            <br>authentication: {windows, basic, anonymous, none}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; model
        </font>
      </td>
    </tr>
    <tr>
      <td>SQL Server Analysis Services Multidimensional</td>
      <td>KPI</td>
      <td>KPI</td>
      <td>
        <font size=2>
            protocol: analysis-services
            <br>authentication: {windows, basic, anonymous, none}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; model
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; objectType: {KPI}
        </font>
      </td>
    </tr>
    <tr>
      <td>SQL Server Analysis Services Multidimensional</td>
      <td>Measure</td>
      <td>Measure</td>
      <td>
        <font size=2>
            protocol: analysis-services
            <br>authentication: {windows, basic, anonymous, none}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; model
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; objectType: {Measure}
        </font>
      </td>
    </tr>
    <tr>
      <td>SQL Server Analysis Services Multidimensional</td>
      <td>Table</td>
      <td>Dimension</td>
      <td>
        <font size=2>
            protocol: analysis-services
            <br>authentication: {windows, basic, anonymous, none}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; model
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; objectType: {Dimension}
        </font>
      </td>
    </tr>
    <tr>
      <td>SQL Server Analysis Services Tabular</td>
      <td>Container</td>
      <td>Model</td>
      <td>
        <font size=2>
            protocol: analysis-services
            <br>authentication: {windows, basic, anonymous, none}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; model
        </font>
      </td>
    </tr>
    <tr>
      <td>SQL Server Analysis Services Tabular</td>
      <td>KPI</td>
      <td>KPI</td>
      <td>
        <font size=2>
            protocol: analysis-services
            <br>authentication: {windows, basic, anonymous, none}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; model
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; objectType: {KPI}
        </font>
      </td>
    </tr>
    <tr>
      <td>SQL Server Analysis Services Tabular</td>
      <td>Measure</td>
      <td>Measure</td>
      <td>
        <font size=2>
            protocol: analysis-services
            <br>authentication: {windows, basic, anonymous, none}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; model
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; objectType: {Measure}
        </font>
      </td>
    </tr>
    <tr>
      <td>SQL Server Analysis Services Tabular</td>
      <td>Table</td>
      <td>Table</td>
      <td>
        <font size=2>
            protocol: analysis-services
            <br>authentication: {windows, basic, anonymous, none}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; model
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; objectType: {Table}
        </font>
      </td>
    </tr>
    <tr>
      <td>SQL Server Reporting Services</td>
      <td>Container</td>
      <td>Server</td>
      <td>
        <font size=2>
            protocol: reporting-services
            <br>authentication: {windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; version: {ReportingService2010}
        </font>
      </td>
    </tr>
    <tr>
      <td>SQL Server Reporting Services</td>
      <td>Report</td>
      <td>Report</td>
      <td>
        <font size=2>
            protocol: reporting-services
            <br>authentication: {windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; path
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; version: {ReportingService2010}
        </font>
      </td>
    </tr>
    <tr>
      <td>Teradata</td>
      <td>Container</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol: teradata
            <br>authentication: {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
        </font>
      </td>
    </tr>
    <tr>
      <td>Teradata</td>
      <td>Table</td>
      <td>Table, View</td>
      <td>
        <font size=2>
            protocol: teradata
            <br>authentication: {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
        </font>
      </td>
    </tr>
    <tr>
      <td>SQL Server Master Data Services</td>
      <td>Container</td>
      <td>Model</td>
      <td>
        <font size="2">
          protocol: mssql-mds
          <br>authentication: {windows}
          <br>address:
          <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
          <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; model
          <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; version
        </font>
      </td>
    </tr>
    <tr>
      <td>SQL Server Master Data Services</td>
      <td>Table</td>
      <td>Entity</td>
      <td>
        <font size="2">
          protocol: mssql-mds
          <br>authentication: {windows}
          <br>address:
          <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
          <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; model
          <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; version
          <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; entity
        </font>
      </td>
    </tr>
    <tr>
      <td>Other (not one of the above)</td>
      <td>\*</td>
      <td>\*</td>
      <td>
        <font size=2>
            protocol: generic-asset
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; assetId
        </font>
      </td>
    </tr>
</table>
