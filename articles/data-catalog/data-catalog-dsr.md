<properties
   pageTitle="Azure Data Catalog supported data sources | Microsoft Azure"
   description="This article lists all data sources and data asset types supported for registration in Azure Data Catalog."
   services="data-catalog"
   documentationCenter=""
   authors="steelanddata"
   manager=""
   editor=""
   tags=""/>
<tags
   ms.service="data-catalog"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-catalog"
   ms.date="03/31/2016"
   ms.author="maroche"/>

# Azure Data Catalog supported data sources

Users of **Azure Data Catalog** can publish metadata using a public API, a ClickOnce data source registration tool, or by manually entering information directly to the Data Catalog web portal.

The table below summarizes all sources currently supported by Data Catalog today, and the publishing capabilities for each.  Also listed are the external data tools that each source can launch from the Data Catalog portal "Open In" experience.

Further below is a second table that provides a more technical specification of each data sources connection properties and the Data Source Reference (DSR) specification used for each supported data asset when using the Data Catalog API.


## List of supported data sources and assets

<table>

    <tr>
       <td><b>Data Asset</b></td>
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
      <td><font size=2>Excel, PowerBI</font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>SQL Data Warehouse View</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>Excel, PowerBI</font></td>
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
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>SQL Server Table</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>Excel, PowerBI</font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>SQL Server View</td>
      <td>✓</td>
      <td>✓</td>
      <td>✓</td>
      <td><font size=2>Excel, PowerBI</font></td>
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
      <td><font size=2></font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>DB2 Table</td>
      <td>✓</td>
      <td></td>
      <td></td>
      <td><font size=2></font></td>
      <td><font size=2></font></td>
    </tr>

    <tr>
      <td>DB2 View</td>
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


<br>
<br>

## Data Source Reference specification

<table>
    <tr>
       <td><b>Source Type</b></td>
       <td><b>Root Type</b></td>
       <td><b>Object Type</b></td>
       <td><b>Contained In Object Type</b></td>
       <td><b>DSR Structure<b></td>
    </tr>


    <tr>
      <td>Azure Data Lake Store</td>
      <td>Table</td>
      <td>Directory</td>
      <td>Data Lake</td>
      <td>
        <font size=2>
            protocol:  webhdfs
            <br>authentication:{basic, oauth}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>

    <tr>
      <td>Azure Data Lake Store</td>
      <td>Table</td>
      <td>File</td>
      <td>Data Lake</td>
      <td>
        <font size=2>
            protocol:  webhdfs}
            <br>authentication:{basic, oauth}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>



    <tr>
      <td>SQL Server Reporting Services</td>
      <td>Container</td>
      <td>Server</td>
      <td>N/A</td>
      <td>
        <font size=2>
            protocol:  reporting-services
            <br>authentication: {windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; version {ReportingService2010}
        </font>
      </td>
    </tr>

    <tr>
      <td>Azure Storage</td>
      <td>Table</td>
      <td>Blob</td>
      <td>Container</td>
      <td>
        <font size=2>
            protocol:azure-blobs
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
      <td>Table</td>
      <td>Directory</td>
      <td>Container</td>
      <td>
        <font size=2>
            protocol:azure-blobs
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
      <td>Table</td>
      <td>Table</td>
      <td>Azure Storage</td>
      <td>
        <font size=2>
            protocol:azure-tables
            <br>authentication: {azure-access-key}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; domain
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; account
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; name
        </font>
      </td>
    </tr>

    <tr>
      <td>SQL Server Analysis Services</td>
      <td>Container</td>
      <td>Model</td>
      <td>N/A</td>
      <td>
        <font size=2>
            protocol:  analysis-services
            <br>authentication: {windows, basic, anonymous}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; model
            <br>
            <br>*basic/anonymous available only over https*
        </font>
      </td>
    </tr>

    <tr>
      <td>DB2</td>
      <td>Container</td>
      <td>Database</td>
      <td>N/A</td>
      <td>
        <font size=2>
            protocol:  db2
            <br>authentication:  {basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
        </font>
      </td>
    </tr>

    <tr>
      <td>DB2</td>
      <td>Table</td>
      <td>Table</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol:  db2
            <br>authentication:  {basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; schema
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
        </font>
      </td>
    </tr>

    <tr>
      <td>DB2</td>
      <td>Table</td>
      <td>View</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol:  db2
            <br>authentication:  {basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; schema
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
        </font>
      </td>
    </tr>

    <tr>
      <td>File System</td>
      <td>Table</td>
      <td>File</td>
      <td>Server</td>
      <td>
        <font size=2>
            protocol:  file
            <br>authentication :  {none, basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; path
        </font>
      </td>
    </tr>

    <tr>
      <td>Ftp</td>
      <td>Table</td>
      <td>Directory</td>
      <td>Server</td>
      <td>
        <font size=2>
            protocol:  ftp
            <br>authentication :  {none, basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>

    <tr>
      <td>Ftp</td>
      <td>Table</td>
      <td>File</td>
      <td>Server</td>
      <td>
        <font size=2>
            protocol:  ftp
            <br>authentication :  {none, basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>

    <tr>
      <td>SQL Server Analysis Services Tabular</td>
      <td>Container</td>
      <td>Model</td>
      <td>N/A</td>
      <td>
        <font size=2>
            protocol:  analysis-services
            <br>authentication: {windows, basic, anonymous}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; model
            <br>
            <br>*basic/anonymous available only over https*
        </font>
      </td>
    </tr>

    <tr>
      <td>Hadoop Distributed File System</td>
      <td>Table</td>
      <td>Directory</td>
      <td>Cluster</td>
      <td>
        <font size=2>
            protocol:webhdfs
            <br>authentication:{basic, oauth}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>

    <tr>
      <td>Hadoop Distributed File System</td>
      <td>Table</td>
      <td>File</td>
      <td>Cluster</td>
      <td>
        <font size=2>
            protocol:webhdfs
            <br>authentication:{basic, oauth}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>

    <tr>
      <td>Azure Data Lake Store</td>
      <td>Container</td>
      <td>Data Lake</td>
      <td>N/A</td>
      <td>
        <font size=2>
            protocol:  webhdfs
            <br>authentication:{basic, oauth}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>

    <tr>
      <td>Hive</td>
      <td>Table</td>
      <td>Table</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol:hive
            <br>authentication: {hdinsight, basic, username}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; connectionProperties
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; serverprotocol: {hive2}
        </font>
      </td>
    </tr>

    <tr>
      <td>Hive</td>
      <td>Table</td>
      <td>View</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol:hive
            <br>authentication: {hdinsight, basic, username}
            <br>address:
server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; connectionProperties
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; serverprotocol: {hive2}
        </font>
      </td>
    </tr>

    <tr>
      <td>Azure Storage</td>
      <td>Container</td>
      <td>Azure Storage</td>
      <td>N/A</td>
      <td>
        <font size=2>
            protocol:azure-tables
            <br>authentication: {azure-access-key}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; domain
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; account
        </font>
      </td>
    </tr>

    <tr>
      <td>Http</td>
      <td>Container</td>
      <td>Site</td>
      <td>N/A</td>
      <td>
        <font size=2>
            protocol:  http
            <br>authentication:   {none, basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>

    <tr>
      <td>Http</td>
      <td>Report</td>
      <td>Report</td>
      <td>Site</td>
      <td>
        <font size=2>
            protocol:  http
            <br>authentication:   {none, basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>

    <tr>
      <td>Http</td>
      <td>Table</td>
      <td>End Point</td>
      <td>Site</td>
      <td>
        <font size=2>
            protocol:  http
            <br>authentication:   {none, basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>

    <tr>
      <td>Azure Storage</td>
      <td>Container</td>
      <td>Container</td>
      <td>N/A</td>
      <td>
        <font size=2>
            protocol:azure-blobs
            <br>authentication: {Azure-Access-Key}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; domain
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; account
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; container
        </font>
      </td>
    </tr>

    <tr>
      <td>MySQL</td>
      <td>Table</td>
      <td>Table</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol:  mysql
            <br>authentication:  {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
        </font>
      </td>
    </tr>

    <tr>
      <td>MySQL</td>
      <td>Table</td>
      <td>View</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol:  mysql
            <br>authentication:  {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
        </font>
      </td>
    </tr>

    <tr>
      <td>Hadoop Distributed File System</td>
      <td>Container</td>
      <td>Cluster</td>
      <td>N/A</td>
      <td>
        <font size=2>
            protocol:webhdfs
            <br>authentication:{basic, oauth}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>

    <tr>
      <td>Http</td>
      <td>Table</td>
      <td>File</td>
      <td>Site</td>
      <td>
        <font size=2>
            protocol:  http
            <br>authentication:   {none, basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>

    <tr>
      <td>Odata</td>
      <td>Container</td>
      <td>Entity Container</td>
      <td>N/A</td>
      <td>
        <font size=2>
            protocol:  odata
            <br>authentication: {none, basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>

    <tr>
      <td>Hive</td>
      <td>Container</td>
      <td>Database</td>
      <td>N/A</td>
      <td>
        <font size=2>
            protocol:  hiveserver2
            <br>authentication: {hdinsight, basic, username, none}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; port
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
        </font>
      </td>
    </tr>

    <tr>
      <td>Odata</td>
      <td>Table</td>
      <td>Entity Set</td>
      <td>Entity Container</td>
      <td>
        <font size=2>
            protocol:  odata
            <br>authentication:  {none, basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; resource
        </font>
      </td>
    </tr>

    <tr>
      <td>Oracle Database</td>
      <td>Table</td>
      <td>Table</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol:  oracle
            <br>authentication:  {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; schema
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
        </font>
      </td>
    </tr>

    <tr>
      <td>Oracle Database</td>
      <td>Table</td>
      <td>View</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol:  oracle
            <br>authentication:  {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; schema
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
        </font>
      </td>
    </tr>

    <tr>
      <td>Odata</td>
      <td>Table</td>
      <td>Function</td>
      <td>Entity Container</td>
      <td>
        <font size=2>
            protocol:  odata
            <br>authentication:  {none, basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; resource
        </font>
      </td>
    </tr>

    <tr>
      <td>Other</td>
      <td>Table</td>
      <td>Other</td>
      <td>N/A</td>
      <td>
        <font size=2>
            protocol:  generic-asset
            <br>authentication:  {none, basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; assetId
        </font>
      </td>
    </tr>

    <tr>
      <td>Postgresql</td>
      <td>Container</td>
      <td>Database</td>
      <td>N/A</td>
      <td>
        <font size=2>
            protocol:  postgresql
            <br>authentication:  {basic, windows}
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
        </font>
      </td>
    </tr>

    <tr>
      <td>Postgresql</td>
      <td>Table</td>
      <td>Table</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol:  postgresql
            <br>authentication:  {basic, windows}
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; schema
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
        </font>
      </td>
    </tr>

    <tr>
      <td>Postgresql</td>
      <td>Table</td>
      <td>View</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol:  postgresql
            <br>authentication:   {basic, windows}
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; schema
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
        </font>
      </td>
    </tr>

    <tr>
      <td>MySQL</td>
      <td>Container</td>
      <td>Database</td>
      <td>N/A</td>
      <td>
        <font size=2>
            protocol:  mysql
            <br>authentication:  {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
        </font>
      </td>
    </tr>
    <tr>
      <td>SAP Hana</td>
      <td>Table</td>
      <td>View</td>
      <td>Server</td>
      <td>
        <font size=2>
            protocol:  sap-hana-sql
            <br>authentication:  {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; schema
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
        </font>
      </td>
    </tr>

    <tr>
      <td>Salesforce</td>
      <td>Table</td>
      <td>Object</td>
      <td>N/A</td>
      <td>
        <font size=2>
            protocol:   salesforce-com
            <br>authenticaiton :  {basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; loginServer
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; class
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; itemName
        </font>
      </td>
    </tr>

    <tr>
      <td>SharePoint</td>
      <td>Table</td>
      <td>List</td>
      <td>Site</td>
      <td>
        <font size=2>
            protocol:  sharepoint-list
            <br>authentication:   {basic, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; url
        </font>
      </td>
    </tr>

    <tr>
      <td>SQL Data Warehouse</td>
      <td>Table</td>
      <td>Table</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol:  tds
            <br>authentication:  {sql, windows}
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
      <td>Table</td>
      <td>View</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol:  tds
            <br>authentication:  {sql, windows}
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
      <td>Table</td>
      <td>Table</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol:  tds
            <br>authentication:  {sql, windows}
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
      <td>Table</td>
      <td>Table-valued Function</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol:  tds
            <br>authentication:  {sql, windows}
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
      <td>Table</td>
      <td>View</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol:  tds
            <br>authentication:  {sql, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; schema
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
        </font>
      </td>
    </tr>

    <tr>
      <td>Oracle Database</td>
      <td>Container</td>
      <td>Database</td>
      <td>N/A</td>
      <td>
        <font size=2>
            protocol:  oracle
            <br>authentication:  {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
        </font>
      </td>
    </tr>

    <tr>
      <td>SQL Server Analysis Services</td>
      <td>KPI</td>
      <td>KPI</td>
      <td>Model</td>
      <td>
        <font size=2>
            protocol:  analysis-services
            <br>authentication: {windows, basic, anonymous}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; model
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; objectType: {Kpi}
            <br>
            <br>*basic/anonymous available only over https*
        </font>
      </td>
    </tr>

    <tr>
      <td>SQL Server Analysis Services</td>
      <td>Measure</td>
      <td>Measure</td>
      <td>Model</td>
      <td>
        <font size=2>
            protocol:  analysis-services
            <br>authentication: {windows, basic, anonymous}
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
      <td>SQL Server Analysis Services</td>
      <td>Table</td>
      <td>Dimension</td>
      <td>Model</td>
      <td>
        <font size=2>
            protocol:  analysis-services
            <br>authentication: {windows, basic, anonymous}
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
      <td>SAP Hana</td>
      <td>Container</td>
      <td>Server</td>
      <td>N/A</td>
      <td>
        <font size=2>
            protocol:  sap-hana-sql
            <br>authentication:  {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
        </font>
      </td>
    </tr>

    <tr>
      <td>SQL Server Analysis Services Tabular</td>
      <td>Table</td>
      <td>Table</td>
      <td>Model</td>
      <td>
        <font size=2>
            protocol:  analysis-services
            <br>authentication: {windows, basic, anonymous}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; model
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; objectType:  {Table}
            <br>
            <br>*basic/anonymous available only over https*
        </font>
      </td>
    </tr>

    <tr>
      <td>SQL Data Warehouse</td>
      <td>Container</td>
      <td>Database</td>
      <td>N/A</td>
      <td>
        <font size=2>
            protocol:  tds
            <br>authentication:  {sql, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
        </font>
      </td>
    </tr>

    <tr>
      <td>SQL Server</td>
      <td>Container</td>
      <td>Database</td>
      <td>N/A</td>
      <td>
        <font size=2>
            protocol:  tds
            <br>authentication:  {sql, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
        </font>
      </td>
    </tr>

    <tr>
      <td>SQL Server Reporting Services</td>
      <td>Report</td>
      <td>Report</td>
      <td>Server</td>
      <td>
        <font size=2>
            protocol:  reporting-services
            <br>authentication: {windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; path
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; version {ReportingService2010}
        </font>
      </td>
    </tr>

    <tr>
      <td>Teradata</td>
      <td>Container</td>
      <td>Database</td>
      <td>N/A</td>
      <td>
        <font size=2>
            protocol:  teradata
            <br>authentication:  {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
        </font>
      </td>
    </tr>

    <tr>
      <td>Teradata</td>
      <td>Table</td>
      <td>Table</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol:  teradata
            <br>authentication:  {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
        </font>
      </td>
    </tr>

    <tr>
      <td>Teradata</td>
      <td>Table</td>
      <td>View</td>
      <td>Database</td>
      <td>
        <font size=2>
            protocol:  teradata
            <br>authentication:  {protocol, windows}
            <br>address:
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; server
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; database
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; object
        </font>
      </td>
    </tr>



</table>
