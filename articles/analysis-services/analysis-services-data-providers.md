---
title: Client libraries required for connecting to Azure Analysis Services | Microsoft Docs
description: Describes client libraries required for client applications and tools to connect Azure Analysis Services
author: minewiskan
manager: kfile
ms.service: azure-analysis-services
ms.topic: conceptual
ms.date: 10/12/2018
ms.author: owend
ms.reviewer: minewiskan

---

# Client libraries for connecting to Azure Analysis Services

Client libraries are necessary for client applications and tools to connect to Analysis Services servers. 

## Download the latest client libraries (Windows Installer)  

|Download  |Product version  | 
|---------|---------|
|[MSOLAP (amd64)](https://go.microsoft.com/fwlink/?linkid=829576)    |    15.0.2.39      |
|[MSOLAP (x86)](https://go.microsoft.com/fwlink/?linkid=829575)     |    15.0.2.39      |
|[AMO](https://go.microsoft.com/fwlink/?linkid=829578)     |   15.7.0.2    |
|[ADOMD](https://go.microsoft.com/fwlink/?linkid=829577)     |    15.7.0.2     |

## AMO and ADOMD (NuGet packages)

Analysis Services Management Objects (AMO) and ADOMD client libraries are available as installable packages from [NuGet.org](https://www.nuget.org/). It's recommended you migrate to NuGet references instead of using Windows Installer. 

|Package  | Product version  | 
|---------|---------|
|[AMO](https://www.nuget.org/packages/Microsoft.AnalysisServices.retail.amd64/)    |    15.7.0.2    |
|[ADOMD](https://www.nuget.org/packages/Microsoft.AnalysisServices.AdomdClient.retail.amd64/)     |   15.7.02     |

NuGet package assemblies AssemblyVersion follow semantic versioning: MAJOR.MINOR.PATCH. NuGet references load the expected version even if there is a different version in the GAC (resulting from MSI install). PATCH is incremented for each release. AMO and ADOMD versions are kept in-sync.

## Understanding client libraries

Analysis Services utilize three client libraries, also known as data providers. ADOMD.NET and Analysis Services Management Objects (AMO) are managed client libraries. The Analysis Services OLE DB Provider (MSOLAP DLL) is a native client library. Typically, all three are installed at the same time. **Azure Analysis Services requires the latest versions of all three libraries**. 

Microsoft client applications like Power BI Desktop and Excel install all three client libraries and update them when new versions are available. Depending on the version or frequency of updates, some client libraries may not be the latest versions required by Azure Analysis Services. The same applies to custom applications or other interfaces such as AsCmd, TOM, ADOMD.NET. These applications require manually or programmatically installing the libraries. The client libraries for manual installation are included in SQL Server feature packs as distributable packages. However, these client libraries are tied to the SQL Server version and may not be the latest.  

Client libraries for client connections are different from data providers required to connect from an Azure Analysis Services server to a data source. To learn more about datasource connections, see [Datasource connections](analysis-services-datasource.md).

## Client library types

### Analysis Services OLE DB Provider (MSOLAP) 

 Analysis Services OLE DB Provider (MSOLAP) is the native client library for Analysis Services database connections. It's used indirectly by both ADOMD.NET and AMO, delegating connection requests to the data provider. You can also call the OLE DB Provider directly from application code.  
  
 The Analysis Services OLE DB Provider is installed automatically by most tools and client applications used to access Analysis Services databases. It must be installed on computers used to access Analysis Services data.  
  
 OLE DB providers are often specified in connection strings. An Analysis Services connection string uses a different nomenclature to refer to the OLE DB Provider: MSOLAP.\<version>.dll.

### AMO  

 AMO is a managed client library used for server administration and data definition. It's installed and used by tools and client applications. For example, SQL Server Management Studio (SSMS) uses AMO to connect to Analysis Services. A connection using AMO is typically minimal, consisting of `“data source=\<servername>”`. After a connection is established, you use the API to work with database collections and major objects. Both SSDT and SSMS use AMO to connect to an Analysis Services instance.  

  
### ADOMD

 ADOMD.NET is a managed data client library used for querying Analysis Services data. It's installed and used by tools and client applications. 
  
 When connecting to a database, the connection string properties for all three libraries are similar. Almost any connection string you define for ADOMD.NET by using  [Microsoft.AnalysisServices.AdomdClient.AdomdConnection.ConnectionString](https://msdn.microsoft.com/library/microsoft.analysisservices.adomdclient.adomdconnection.connectionstring.aspx) also works for AMO and the Analysis Services OLE DB Provider (MSOLAP). To learn more, see [Connection string properties &#40;Analysis Services&#41;](https://docs.microsoft.com/sql/analysis-services/instances/connection-string-properties-analysis-services).  

  
##  <a name="bkmk_LibUpdate"></a> How to determine client library version   
  
### OLEDDB (MSOLAP)  
  
1.  Go to `C:\Program Files\Microsoft Analysis Services\AS OLEDB\`. If you have more than one folder, choose the higher number.
  
2.  Right-click **msolap.dll** > **Properties** > **Details**. If the filename is msolap140.dll, it's older than latest version and should be upgraded.
    
    ![Client library details](media/analysis-services-data-providers/aas-msolap-details.png)
    
  
### AMO

1. Go to `C:\Windows\Microsoft.NET\assembly\GAC_MSIL\Microsoft.AnalysisServices\`. If you have more than one folder, choose the higher number.
2. Right-click **Microsoft.AnalysisServices** > **Properties** > **Details**.  

### ADOMD

1. Go to `C:\Windows\Microsoft.NET\assembly\GAC_MSIL\Microsoft.AnalysisServices.AdomdClient\`. If you have more than one folder, choose the higher number.
2. Right-click **Microsoft.AnalysisServices.AdomdClient** > **Properties** > **Details**.  


## Next steps
[Connect with Excel](analysis-services-connect-excel.md)    
[Connect with Power BI](analysis-services-connect-pbi.md)
