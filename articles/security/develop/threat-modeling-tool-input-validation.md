---
title: Input Validation - Microsoft Threat Modeling Tool - Azure | Microsoft Docs
description: mitigations for threats exposed in the Threat Modeling Tool 
services: security
documentationcenter: na
author: jegeib
manager: jegeib
editor: jegeib

ms.assetid: na
ms.service: security
ms.subservice: security-develop
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/07/2017
ms.author: jegeib

---

# Security Frame: Input Validation | Mitigations 
| Product/Service | Article |
| --------------- | ------- |
| **Web Application** | <ul><li>[Disable XSLT scripting for all transforms using untrusted style sheets](#disable-xslt)</li><li>[Ensure that each page that could contain user controllable content opts out of automatic MIME sniffing](#out-sniffing)</li><li>[Harden or Disable XML Entity Resolution](#xml-resolution)</li><li>[Applications utilizing http.sys perform URL canonicalization verification](#app-verification)</li><li>[Ensure appropriate controls are in place when accepting files from users](#controls-users)</li><li>[Ensure that type-safe parameters are used in Web Application for data access](#typesafe)</li><li>[Use separate model binding classes or binding filter lists to prevent MVC mass assignment vulnerability](#binding-mvc)</li><li>[Encode untrusted web output prior to rendering](#rendering)</li><li>[Perform input validation and filtering on all string type Model properties](#typemodel)</li><li>[Sanitization should be applied on form fields that accept all characters, e.g, rich text editor](#richtext)</li><li>[Do not assign DOM elements to sinks that do not have inbuilt encoding](#inbuilt-encode)</li><li>[Validate all redirects within the application are closed or done safely](#redirect-safe)</li><li>[Implement input validation on all string type parameters accepted by Controller methods](#string-method)</li><li>[Set upper limit timeout for regular expression processing to prevent DoS due to bad regular expressions](#dos-expression)</li><li>[Avoid using Html.Raw in Razor views](#html-razor)</li></ul> | 
| **Database** | <ul><li>[Do not use dynamic queries in stored procedures](#stored-proc)</li></ul> |
| **Web API** | <ul><li>[Ensure that model validation is done on Web API methods](#validation-api)</li><li>[Implement input validation on all string type parameters accepted by Web API methods](#string-api)</li><li>[Ensure that type-safe parameters are used in Web API for data access](#typesafe-api)</li></ul> | 
| **Azure Document DB** | <ul><li>[Use parameterized SQL queries for Azure Cosmos DB](#sql-docdb)</li></ul> | 
| **WCF** | <ul><li>[WCF Input validation through Schema binding](#schema-binding)</li><li>[WCF- Input validation through Parameter Inspectors](#parameters)</li></ul> |

## <a id="disable-xslt"></a>Disable XSLT scripting for all transforms using untrusted style sheets

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [XSLT Security](https://msdn.microsoft.com/library/ms763800(v=vs.85).aspx), [XsltSettings.EnableScript Property](https://msdn.microsoft.com/library/system.xml.xsl.xsltsettings.enablescript.aspx) |
| **Steps** | XSLT supports scripting inside style sheets using the `<msxml:script>` element. This allows custom functions to be used in an XSLT transformation. The script is executed under the context of the process performing the transform. XSLT script must be disabled when in an untrusted environment to prevent execution of untrusted code. *If using .NET:* XSLT scripting is disabled by default; however, you must ensure that it has not been explicitly enabled through the `XsltSettings.EnableScript` property.|

### Example 

```csharp
XsltSettings settings = new XsltSettings();
settings.EnableScript = true; // WRONG: THIS SHOULD BE SET TO false
```

### Example
If you are using MSXML 6.0, XSLT scripting is disabled by default; however, you must ensure that it has not been explicitly enabled through the XML DOM object property AllowXsltScript. 

```csharp
doc.setProperty("AllowXsltScript", true); // WRONG: THIS SHOULD BE SET TO false
```

### Example
If you are using MSXML 5 or below, XSLT scripting is enabled by default and you must explicitly disable it. Set the XML DOM object property AllowXsltScript to false. 

```csharp
doc.setProperty("AllowXsltScript", false); // CORRECT. Setting to false disables XSLT scripting.
```

## <a id="out-sniffing"></a>Ensure that each page that could contain user controllable content opts out of automatic MIME sniffing

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [IE8 Security Part V - Comprehensive Protection](https://docs.microsoft.com/archive/blogs/ie/ie8-security-part-v-comprehensive-protection)  |
| **Steps** | <p>For each page that could contain user controllable content, you must use the HTTP Header `X-Content-Type-Options:nosniff`. To comply with this requirement, you can either set the required header page by page for only those pages that might contain user-controllable content, or you can set it globally for all pages in the application.</p><p>Each type of file delivered from a web server has an associated [MIME type](https://en.wikipedia.org/wiki/Mime_type) (also called a *content-type*) that describes the nature of the content (that is, image, text, application, etc.)</p><p>The X-Content-Type-Options header is an HTTP header that allows developers to specify that their content should not be MIME-sniffed. This header is designed to mitigate MIME-Sniffing attacks. Support for this header was added in Internet Explorer 8 (IE8)</p><p>Only users of Internet Explorer 8 (IE8) will benefit from X-Content-Type-Options. Previous versions of Internet Explorer do not currently respect the X-Content-Type-Options header</p><p>Internet Explorer 8 (and later) are the only major browsers to implement a MIME-sniffing opt-out feature. If and when other major browsers (Firefox, Safari, Chrome) implement similar features, this recommendation will be updated to include syntax for those browsers as well</p>|

### Example
To enable the required header globally for all pages in the application, you can do one of the following: 

* Add the header in the web.config file if the application is hosted by Internet Information Services (IIS) 7 

```
<system.webServer> 
  <httpProtocol> 
    <customHeaders> 
      <add name=""X-Content-Type-Options"" value=""nosniff""/>
    </customHeaders>
  </httpProtocol>
</system.webServer> 
```

* Add the header through the global Application\_BeginRequest 

``` 
void Application_BeginRequest(object sender, EventArgs e)
{
  this.Response.Headers[""X-Content-Type-Options""] = ""nosniff"";
} 
```

* Implement custom HTTP module 

``` 
public class XContentTypeOptionsModule : IHttpModule 
  {
    #region IHttpModule Members 
    public void Dispose() 
    { 

    } 
    public void Init(HttpApplication context)
    { 
      context.PreSendRequestHeaders += newEventHandler(context_PreSendRequestHeaders); 
    } 
    #endregion 
    void context_PreSendRequestHeaders(object sender, EventArgs e) 
      { 
        HttpApplication application = sender as HttpApplication; 
        if (application == null) 
          return; 
        if (application.Response.Headers[""X-Content-Type-Options ""] != null) 
          return; 
        application.Response.Headers.Add(""X-Content-Type-Options "", ""nosniff""); 
      } 
  } 

``` 

* You can enable the required header only for specific pages by adding it to individual responses: 

```
this.Response.Headers[""X-Content-Type-Options""] = ""nosniff""; 
``` 

## <a id="xml-resolution"></a>Harden or Disable XML Entity Resolution

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [XML Entity Expansion](https://capec.mitre.org/data/definitions/197.html), [XML Denial of Service Attacks and Defenses](https://msdn.microsoft.com/magazine/ee335713.aspx), [MSXML Security Overview](https://msdn.microsoft.com/library/ms754611(v=VS.85).aspx), [Best Practices for Securing MSXML Code](https://msdn.microsoft.com/library/ms759188(VS.85).aspx), [NSXMLParserDelegate Protocol Reference](https://developer.apple.com/library/ios/#documentation/cocoa/reference/NSXMLParserDelegate_Protocol/Reference/Reference.html), [Resolving External References](https://msdn.microsoft.com/library/5fcwybb2.aspx) |
| **Steps**| <p>Although it is not widely used, there is a feature of XML that allows the XML parser to expand macro entities with values defined either within the document itself or from external sources. For example, the document might define an entity "companyname" with the value "Microsoft," so that every time the text "&companyname;" appears in the document, it is automatically replaced with the text Microsoft. Or, the document might define an entity "MSFTStock" that references an external web service to fetch the current value of Microsoft stock.</p><p>Then any time "&MSFTStock;" appears in the document, it is automatically replaced with the current stock price. However, this functionality can be abused to create denial of service (DoS) conditions. An attacker can nest multiple entities to create an exponential expansion XML bomb that consumes all available memory on the system. </p><p>Alternatively, he can create an external reference that streams back an infinite amount of data or that simply hangs the thread. As a result, all teams must disable internal and/or external XML entity resolution entirely if their application does not use it, or manually limit the amount of memory and time that the application can consume for entity resolution if this functionality is absolutely necessary. If entity resolution is not required by your application, then disable it. </p>|

### Example
For .NET Framework code, you can use the following approaches:

```csharp
XmlTextReader reader = new XmlTextReader(stream);
reader.ProhibitDtd = true;

XmlReaderSettings settings = new XmlReaderSettings();
settings.ProhibitDtd = true;
XmlReader reader = XmlReader.Create(stream, settings);

// for .NET 4
XmlReaderSettings settings = new XmlReaderSettings();
settings.DtdProcessing = DtdProcessing.Prohibit;
XmlReader reader = XmlReader.Create(stream, settings);
```
Note that the default value of `ProhibitDtd` in `XmlReaderSettings` is true, but in `XmlTextReader` it is false. If you are using XmlReaderSettings, you do not need to set ProhibitDtd to true explicitly, but it is recommended for safety sake that you do. Also note that the XmlDocument class allows entity resolution by default. 

### Example
To disable entity resolution for XmlDocuments, use the `XmlDocument.Load(XmlReader)` overload of the Load method and set the appropriate properties in the XmlReader argument to disable resolution, as illustrated in the following code: 

```csharp
XmlReaderSettings settings = new XmlReaderSettings();
settings.ProhibitDtd = true;
XmlReader reader = XmlReader.Create(stream, settings);
XmlDocument doc = new XmlDocument();
doc.Load(reader);
```

### Example
If disabling entity resolution is not possible for your application, set the XmlReaderSettings.MaxCharactersFromEntities property to a reasonable value according to your application's needs. This will limit the impact of potential exponential expansion DoS attacks. The following code provides an example of this approach: 

```csharp
XmlReaderSettings settings = new XmlReaderSettings();
settings.ProhibitDtd = false;
settings.MaxCharactersFromEntities = 1000;
XmlReader reader = XmlReader.Create(stream, settings);
```

### Example
If you need to resolve inline entities but do not need to resolve external entities, set the XmlReaderSettings.XmlResolver property to null. For example: 

```csharp
XmlReaderSettings settings = new XmlReaderSettings();
settings.ProhibitDtd = false;
settings.MaxCharactersFromEntities = 1000;
settings.XmlResolver = null;
XmlReader reader = XmlReader.Create(stream, settings);
```
Note that in MSXML6, ProhibitDTD is set to true (disabling DTD processing) by default. For Apple OSX/iOS code, there are two XML parsers you can use: NSXMLParser and libXML2. 

## <a id="app-verification"></a>Applications utilizing http.sys perform URL canonicalization verification

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | <p>Any application that uses http.sys should follow these guidelines:</p><ul><li>Limit the URL length to no more than 16,384 characters (ASCII or Unicode). This is the absolute maximum URL length based on the default Internet Information Services (IIS) 6 setting. Websites should strive for a length shorter than this if possible</li><li>Use the standard .NET Framework file I/O classes (such as FileStream) as these will take advantage of the canonicalization rules in the .NET FX</li><li>Explicitly build an allow-list of known filenames</li><li>Explicitly reject known filetypes you will not serve UrlScan rejects: exe, bat, cmd, com, htw, ida, idq, htr, idc, shtm[l], stm, printer, ini, pol, dat files</li><li>Catch the following exceptions:<ul><li>System.ArgumentException (for device names)</li><li>System.NotSupportedException (for data streams)</li><li>System.IO.FileNotFoundException (for invalid escaped filenames)</li><li>System.IO.DirectoryNotFoundException (for invalid escaped dirs)</li></ul></li><li>*Do not* call out to Win32 file I/O APIs. On an invalid URL gracefully return a 400 error to the user, and log the real error.</li></ul>|

## <a id="controls-users"></a>Ensure appropriate controls are in place when accepting files from users

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Unrestricted File Upload](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload), [File Signature Table](https://www.garykessler.net/library/file_sigs.html) |
| **Steps** | <p>Uploaded files represent a significant risk to applications.</p><p>The first step in many attacks is to get some code to the system to be attacked. Then the attack only needs to find a way to get the code executed. Using a file upload helps the attacker accomplish the first step. The consequences of unrestricted file upload can vary, including complete system takeover, an overloaded file system or database, forwarding attacks to back-end systems, and simple defacement.</p><p>It depends on what the application does with the uploaded file and especially where it is stored. Server side validation of file uploads is missing. Following security controls should be implemented for File Upload functionality:</p><ul><li>File Extension check (only a valid set of allowed file type should be accepted)</li><li>Maximum file size limit</li><li>File should not be uploaded to webroot; the location should be a directory on non-system drive</li><li>Naming convention should be followed, such that the uploaded file name have some randomness, so as to prevent file overwrites</li><li>Files should be scanned for anti-virus before writing to the disk</li><li>Ensure that the file name and any other metadata (e.g., file path) are validated for malicious characters</li><li>File format signature should be checked, to prevent a user from uploading a masqueraded file (e.g., uploading an exe file by changing extension to txt)</li></ul>| 

### Example
For the last point regarding file format signature validation, refer to the class below for details: 

```csharp
        private static Dictionary<string, List<byte[]>> fileSignature = new Dictionary<string, List<byte[]>>
                    {
                    { ".DOC", new List<byte[]> { new byte[] { 0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1 } } },
                    { ".DOCX", new List<byte[]> { new byte[] { 0x50, 0x4B, 0x03, 0x04 } } },
                    { ".PDF", new List<byte[]> { new byte[] { 0x25, 0x50, 0x44, 0x46 } } },
                    { ".ZIP", new List<byte[]> 
                                            {
                                              new byte[] { 0x50, 0x4B, 0x03, 0x04 },
                                              new byte[] { 0x50, 0x4B, 0x4C, 0x49, 0x54, 0x55 },
                                              new byte[] { 0x50, 0x4B, 0x53, 0x70, 0x58 },
                                              new byte[] { 0x50, 0x4B, 0x05, 0x06 },
                                              new byte[] { 0x50, 0x4B, 0x07, 0x08 },
                                              new byte[] { 0x57, 0x69, 0x6E, 0x5A, 0x69, 0x70 }
                                                }
                                            },
                    { ".PNG", new List<byte[]> { new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A } } },
                    { ".JPG", new List<byte[]>
                                    {
                                              new byte[] { 0xFF, 0xD8, 0xFF, 0xE0 },
                                              new byte[] { 0xFF, 0xD8, 0xFF, 0xE1 },
                                              new byte[] { 0xFF, 0xD8, 0xFF, 0xE8 }
                                    }
                                    },
                    { ".JPEG", new List<byte[]>
                                        { 
                                            new byte[] { 0xFF, 0xD8, 0xFF, 0xE0 },
                                            new byte[] { 0xFF, 0xD8, 0xFF, 0xE2 },
                                            new byte[] { 0xFF, 0xD8, 0xFF, 0xE3 }
                                        }
                                        },
                    { ".XLS", new List<byte[]>
                                            {
                                              new byte[] { 0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1 },
                                              new byte[] { 0x09, 0x08, 0x10, 0x00, 0x00, 0x06, 0x05, 0x00 },
                                              new byte[] { 0xFD, 0xFF, 0xFF, 0xFF }
                                            }
                                            },
                    { ".XLSX", new List<byte[]> { new byte[] { 0x50, 0x4B, 0x03, 0x04 } } },
                    { ".GIF", new List<byte[]> { new byte[] { 0x47, 0x49, 0x46, 0x38 } } }
                };

        public static bool IsValidFileExtension(string fileName, byte[] fileData, byte[] allowedChars)
        {
            if (string.IsNullOrEmpty(fileName) || fileData == null || fileData.Length == 0)
            {
                return false;
            }

            bool flag = false;
            string ext = Path.GetExtension(fileName);
            if (string.IsNullOrEmpty(ext))
            {
                return false;
            }

            ext = ext.ToUpperInvariant();

            if (ext.Equals(".TXT") || ext.Equals(".CSV") || ext.Equals(".PRN"))
            {
                foreach (byte b in fileData)
                {
                    if (b > 0x7F)
                    {
                        if (allowedChars != null)
                        {
                            if (!allowedChars.Contains(b))
                            {
                                return false;
                            }
                        }
                        else
                        {
                            return false;
                        }
                    }
                }

                return true;
            }

            if (!fileSignature.ContainsKey(ext))
            {
                return true;
            }

            List<byte[]> sig = fileSignature[ext];
            foreach (byte[] b in sig)
            {
                var curFileSig = new byte[b.Length];
                Array.Copy(fileData, curFileSig, b.Length);
                if (curFileSig.SequenceEqual(b))
                {
                    flag = true;
                    break;
                }
            }

            return flag;
        }
```

## <a id="typesafe"></a>Ensure that type-safe parameters are used in Web Application for data access

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | <p>If you use the Parameters collection, SQL treats the input is as a literal value rather then as executable code. The Parameters collection can be used to enforce type and length constraints on input data. Values outside of the range trigger an exception. If type-safe SQL parameters are not used, attackers might be able to execute injection attacks that are embedded in the unfiltered input.</p><p>Use type safe parameters when constructing SQL queries to avoid possible SQL injection attacks that can occur with unfiltered input. You can use type safe parameters with stored procedures and with dynamic SQL statements. Parameters are treated as literal values by the database and not as executable code. Parameters are also checked for type and length.</p>|

### Example 
The following code shows how to use type safe parameters with the SqlParameterCollection when calling a stored procedure. 

```csharp
using System.Data;
using System.Data.SqlClient;

using (SqlConnection connection = new SqlConnection(connectionString))
{ 
DataSet userDataset = new DataSet(); 
SqlDataAdapter myCommand = new SqlDataAdapter("LoginStoredProcedure", connection); 
myCommand.SelectCommand.CommandType = CommandType.StoredProcedure; 
myCommand.SelectCommand.Parameters.Add("@au_id", SqlDbType.VarChar, 11); 
myCommand.SelectCommand.Parameters["@au_id"].Value = SSN.Text; 
myCommand.Fill(userDataset);
}  
```
In the preceding code example, the input value cannot be longer than 11 characters. If the data does not conform to the type or length defined by the parameter, the SqlParameter class throws an exception. 

## <a id="binding-mvc"></a>Use separate model binding classes or binding filter lists to prevent MVC mass assignment vulnerability

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | MVC5, MVC6 |
| **Attributes**              | N/A  |
| **References**              | [Metadata Attributes](https://msdn.microsoft.com/library/system.componentmodel.dataannotations.metadatatypeattribute), [Public Key Security Vulnerability And Mitigation](https://github.com/blog/1068-public-key-security-vulnerability-and-mitigation), [Complete Guide to Mass Assignment in ASP.NET MVC](https://odetocode.com/Blogs/scott/archive/2012/03/11/complete-guide-to-mass-assignment-in-asp-net-mvc.aspx), [Getting Started with EF using MVC](https://www.asp.net/mvc/tutorials/getting-started-with-ef-using-mvc/implementing-basic-crud-functionality-with-the-entity-framework-in-asp-net-mvc-application#overpost) |
| **Steps** | <ul><li>**When should I look for over-posting vulnerabilities? -** Over-posting vulnerabilities can occur any place you bind model classes from user input. Frameworks like MVC can represent user data in custom .NET classes, including Plain Old CLR Objects (POCOs). MVC automatically populates these model classes with data from the request, providing a convenient representation for dealing with user input. When these classes include properties that should not be set by the user, the application can be vulnerable to over-posting attacks, which allow user control of data that the application never intended. Like MVC model binding, database access technologies such as object/relational mappers like Entity Framework often also support using POCO objects to represent database data. These data model classes provide the same convenience in dealing with database data as MVC does in dealing with user input. Because both MVC and the database support similar models, like POCO objects, it seems easy to reuse the same classes for both purposes. This practice fails to preserve separation of concerns, and it is one common area where unintended properties are exposed to model binding, enabling over-posting attacks.</li><li>**Why shouldn't I use my unfiltered database model classes as parameters to my MVC actions? -** Because MVC model binding will bind anything in that class. Even if the data does not appear in your view, a malicious user can send an HTTP request with this data included, and MVC will gladly bind it because your action says that database class is the shape of data it should accept for user input.</li><li>**Why should I care about the shape used for model binding? -** Using ASP.NET MVC model binding with overly broad models exposes an application to over-posting attacks. Over-posting could enable attackers to change application data beyond what the developer intended, such as overriding the price for an item or the security privileges for an account. Applications should use action-specific binding models (or specific allowed property filter lists) to provide an explicit contract for what untrusted input to allow via model binding.</li><li>**Is having separate binding models just duplicating code? -** No, it is a matter of separation of concerns. If you reuse database models in action methods, you are saying any property (or sub-property) in that class can be set by the user in an HTTP request. If that is not what you want MVC to do, you need a filter list or a separate class shape to show MVC what data can come from user input instead.</li><li>**If I have separate binding models for user input, do I have to duplicate all my data annotation attributes? -** Not necessarily. You can use MetadataTypeAttribute on the database model class to link to the metadata on a model binding class. Just note that the type referenced by the MetadataTypeAttribute must be a subset of the referencing type (it can have fewer properties, but not more).</li><li>**Moving data back and forth between user input models and database models is tedious. Can I just copy over all properties using reflection? -** Yes. The only properties that appear in the binding models are the ones you have determined to be safe for user input. There is no security reason that prevents using reflection to copy over all properties that exist in common between these two models.</li><li>**What about [Bind(Exclude ="â&euro;¦")]. Can I use that instead of having separate binding models? -** This approach is not recommended. Using [Bind(Exclude ="â&euro;¦")] means that any new property is bindable by default. When a new property is added, there is an extra step to remember to keep things secure, rather than having the design be secure by default. Depending on the developer checking this list every time a property is added is risky.</li><li>**Is [Bind(Include ="â&euro;¦")] useful for Edit operations? -** No. [Bind(Include ="â&euro;¦")] is only suitable for INSERT-style operations (adding new data). For UPDATE-style operations (revising existing data), use another approach, like having separate binding models or passing an explicit list of allowed properties to UpdateModel or TryUpdateModel. Adding a [Bind(Include ="â&euro;¦")] attribute on an Edit operation means that MVC will create an object instance and set only the listed properties, leaving all others at their default values. When the data is persisted, it will entirely replace the existing entity, resetting the values for any omitted properties to their defaults. For example, if IsAdmin was omitted from a [Bind(Include ="â&euro;¦")] attribute on an Edit operation, any user whose name was edited via this action would be reset to IsAdmin = false (any edited user would lose administrator status). If you want to prevent updates to certain properties, use one of the other approaches above. Note that some versions of MVC tooling generate controller classes with [Bind(Include ="â&euro;¦")] on Edit actions and imply that removing a property from that list will prevent over-posting attacks. However, as described above, that approach does not work as intended and instead will reset any data in the omitted properties to their default values.</li><li>**For Create operations, are there any caveats using [Bind(Include ="â&euro;¦")] rather than separate binding models? -** Yes. First this approach does not work for Edit scenarios, requiring maintaining two separate approaches for mitigating all over-posting vulnerabilities. Second, separate binding models enforce separation of concerns between the shape used for user input and the shape used for persistence, something [Bind(Include ="â&euro;¦")] does not do. Third, note that [Bind(Include ="â&euro;¦")] can only handle top-level properties; you cannot allow only portions of sub-properties (such as "Details.Name") in the attribute. Finally, and perhaps most importantly, using [Bind(Include ="â&euro;¦")] adds an extra step that must be remembered any time the class is used for model binding. If a new action method binds to the data class directly and forgets to include a [Bind(Include ="â&euro;¦")] attribute, it can be vulnerable to over-posting attacks, so the [Bind(Include ="â&euro;¦")] approach is somewhat less secure by default. If you use [Bind(Include ="â&euro;¦")], take care always to remember to specify it every time your data classes appear as action method parameters.</li><li>**For Create operations, what about putting the [Bind(Include ="â&euro;¦")] attribute on the model class itself? Does not this approach avoid the need to remember putting the attribute on every action method? -** This approach works in some cases. Using [Bind(Include ="â&euro;¦")] on the model type itself (rather than on action parameters using this class), does avoid the need to remember to include the [Bind(Include ="â&euro;¦")] attribute on every action method. Using the attribute directly on the class effectively creates a separate surface area of this class for model binding purposes. However, this approach only allows for one model binding shape per model class. If one action method needs to allow model binding of a field (for example, an administrator-only action that updates user roles) and other actions need to prevent model binding of this field, this approach will not work. Each class can only have one model binding shape; if different actions need different model binding shapes, they need to represent these separate shapes using either separate model binding classes or separate [Bind(Include ="â&euro;¦")] attributes on the action methods.</li><li>**What are binding models? Are they the same thing as view models? -** These are two related concepts. The term binding model refers to a model class used in an action's parameter list (the shape passed from MVC model binding to the action method). The term view model refers to a model class passed from an action method to a view. Using a view-specific model is a common approach for passing data from an action method to a view. Often, this shape is also suitable for model binding, and the term view model can be used to refer the same model used in both places. To be precise, this procedure talks specifically about binding models, focusing on the shape passed to the action, which is what matters for mass assignment purposes.</li></ul>| 

## <a id="rendering"></a>Encode untrusted web output prior to rendering

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic, Web Forms, MVC5, MVC6 |
| **Attributes**              | N/A  |
| **References**              | [How to prevent Cross-site scripting in ASP.NET](https://msdn.microsoft.com/library/ms998274.aspx), [Cross-site Scripting](https://cwe.mitre.org/data/definitions/79.html), [XSS (Cross Site Scripting) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) |
| **Steps** | Cross-site scripting (commonly abbreviated as XSS) is an attack vector for online services or any application/component that consumes input from the web. XSS vulnerabilities may allow an attacker to execute script on another user's machine through a vulnerable web application. Malicious scripts can be used to steal cookies and otherwise tamper with a victim's machine through JavaScript. XSS is prevented by validating user input, ensuring it is well formed and encoding before it is rendered in a web page. Input validation and output encoding can be done by using Web Protection Library. For Managed code (C\#, VB.NET, etc.), use one or more appropriate encoding methods from the Web Protection (Anti-XSS) Library, depending on the context where the user input gets manifested:| 

### Example

```csharp
* Encoder.HtmlEncode 
* Encoder.HtmlAttributeEncode 
* Encoder.JavaScriptEncode 
* Encoder.UrlEncode
* Encoder.VisualBasicScriptEncode 
* Encoder.XmlEncode 
* Encoder.XmlAttributeEncode 
* Encoder.CssEncode 
* Encoder.LdapEncode 
```

## <a id="typemodel"></a>Perform input validation and filtering on all string type Model properties

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic, MVC5, MVC6 |
| **Attributes**              | N/A  |
| **References**              | [Adding Validation](https://www.asp.net/mvc/overview/getting-started/introduction/adding-validation), [Validating Model Data in an MVC Application](https://msdn.microsoft.com/library/dd410404(v=vs.90).aspx), [Guiding Principles For Your ASP.NET MVC Applications](https://msdn.microsoft.com/magazine/dd942822.aspx) |
| **Steps** | <p>All the input parameters must be validated before they are used in the application to ensure that the application is safeguarded against malicious user inputs. Validate the input values using regular expression validations on server side with a whitelist validation strategy. Unsanitized user inputs / parameters passed to the methods can cause code injection vulnerabilities.</p><p>For web applications, entry points can also include form fields, QueryStrings, cookies, HTTP headers, and web service parameters.</p><p>The following input validation checks must be performed upon model binding:</p><ul><li>The model properties should be annotated with RegularExpression annotation, for accepting allowed characters and maximum permissible length</li><li>The controller methods should perform ModelState validity</li></ul>|

## <a id="richtext"></a>Sanitization should be applied on form fields that accept all characters, e.g, rich text editor

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Encode Unsafe Input](https://msdn.microsoft.com/library/ff647397.aspx#paght000003_step3), [HTML Sanitizer](https://github.com/mganss/HtmlSanitizer) |
| **Steps** | <p>Identify all static markup tags that you want to use. A common practice is to restrict formatting to safe HTML elements, such as `<b>` (bold) and `<i>` (italic).</p><p>Before writing the data, HTML-encode it. This makes any malicious script safe by causing it to be handled as text, not as executable code.</p><ol><li>Disable ASP.NET request validation by the adding the ValidateRequest="false" attribute to the \@ Page directive</li><li>Encode the string input with the HtmlEncode method</li><li>Use a StringBuilder and call its Replace method to selectively remove the encoding on the HTML elements that you want to permit</li></ol><p>The page-in the references disables ASP.NET request validation by setting `ValidateRequest="false"`. It HTML-encodes the input and selectively allows the `<b>` and `<i>` Alternatively, a .NET library for HTML sanitization may also be used.</p><p>HtmlSanitizer is a .NET library for cleaning HTML fragments and documents from constructs that can lead to XSS attacks. It uses AngleSharp to parse, manipulate, and render HTML and CSS. HtmlSanitizer can be installed as a NuGet package, and the user input can be passed through relevant HTML or CSS sanitization methods, as applicable, on the server side. Please note that Sanitization as a security control should be considered only as a last option.</p><p>Input validation and Output Encoding are considered better security controls.</p> |

## <a id="inbuilt-encode"></a>Do not assign DOM elements to sinks that do not have inbuilt encoding

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Many javascript functions don't do encoding by default. When assigning untrusted input to DOM elements via such functions, may result in cross site script (XSS) executions.| 

### Example
Following are insecure examples: 

```
document.getElementByID("div1").innerHtml = value;
$("#userName").html(res.Name);
return $('<div/>').html(value)
$('body').append(resHTML);   
```
Don't use `innerHtml`; instead use `innerText`. Similarly, instead of `$("#elm").html()`, use `$("#elm").text()` 

## <a id="redirect-safe"></a>Validate all redirects within the application are closed or done safely

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [The OAuth 2.0 Authorization Framework - Open Redirectors](https://tools.ietf.org/html/rfc6749#section-10.15) |
| **Steps** | <p>Application design requiring redirection to a user-supplied location must constrain the possible redirection targets to a predefined "safe" list of sites or domains. All redirects in the application must be closed/safe.</p><p>To do this:</p><ul><li>Identify all redirects</li><li>Implement an appropriate mitigation for each redirect. Appropriate mitigations include redirect whitelist or user confirmation. If a web site or service with an open redirect vulnerability uses Facebook/OAuth/OpenID identity providers, an attacker can steal a user's logon token and impersonate that user. This is an inherent risk when using OAuth, which is documented in RFC 6749 "The OAuth 2.0 Authorization Framework", Section 10.15 "Open Redirects" Similarly, users' credentials can be compromised by spear phishing attacks using open redirects</li></ul>|

## <a id="string-method"></a>Implement input validation on all string type parameters accepted by Controller methods

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic, MVC5, MVC6 |
| **Attributes**              | N/A  |
| **References**              | [Validating Model Data in an MVC Application](https://msdn.microsoft.com/library/dd410404(v=vs.90).aspx), [Guiding Principles For Your ASP.NET MVC Applications](https://msdn.microsoft.com/magazine/dd942822.aspx) |
| **Steps** | For methods that just accept primitive data type, and not models as argument,input validation using Regular Expression should be done. Here Regex.IsMatch should be used with a valid regex pattern. If the input doesn't match the specified Regular Expression, control should not proceed further, and an adequate warning regarding validation failure should be displayed.| 

## <a id="dos-expression"></a>Set upper limit timeout for regular expression processing to prevent DoS due to bad regular expressions

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic, Web Forms, MVC5, MVC6  |
| **Attributes**              | N/A  |
| **References**              | [DefaultRegexMatchTimeout Property](https://msdn.microsoft.com/library/system.web.configuration.httpruntimesection.defaultregexmatchtimeout.aspx) |
| **Steps** | To ensure denial of service attacks against badly created regular expressions, that cause a lot of backtracking, set the global default timeout. If the processing time takes longer than the defined upper limit, it would throw a Timeout exception. If nothing is configured, the timeout would be infinite.| 

### Example
For example, the following configuration will throw a RegexMatchTimeoutException, if the processing takes more than 5 seconds: 

```csharp
<httpRuntime targetFramework="4.5" defaultRegexMatchTimeout="00:00:05" />
```

## <a id="html-razor"></a>Avoid using Html.Raw in Razor views

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | MVC5, MVC6 |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| Step | ASP.NET WebPages (Razor) perform automatic HTML encoding. All strings printed by embedded code nuggets (@ blocks) are automatically HTML-encoded. However, when `HtmlHelper.Raw` Method is invoked, it returns markup that is not HTML encoded. If `Html.Raw()` helper method is used, it bypasses the automatic encoding protection that Razor provides.|

### Example
Following is an insecure example: 

```csharp
<div class="form-group">
            @Html.Raw(Model.AccountConfirmText)
        </div>
        <div class="form-group">
            @Html.Raw(Model.PaymentConfirmText)
        </div>
</div>
```
Do not use `Html.Raw()` unless you need to display markup. This method does not perform output encoding implicitly. Use other ASP.NET helpers e.g., `@Html.DisplayFor()` 

## <a id="stored-proc"></a>Do not use dynamic queries in stored procedures

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | <p>A SQL injection attack exploits vulnerabilities in input validation to run arbitrary commands in the database. It can occur when your application uses input to construct dynamic SQL statements to access the database. It can also occur if your code uses stored procedures that are passed strings that contain raw user input. Using the SQL injection attack, the attacker can execute arbitrary commands in the database. All SQL statements (including the SQL statements in stored procedures) must be parameterized. Parameterized SQL statements will accept characters that have special meaning to SQL (like single quote) without problems because they are strongly typed. |

### Example
Following is an example of insecure dynamic Stored Procedure: 

```csharp
CREATE PROCEDURE [dbo].[uspGetProductsByCriteria]
(
  @productName nvarchar(200) = NULL,
  @startPrice float = NULL,
  @endPrice float = NULL
)
AS
 BEGIN
  DECLARE @sql nvarchar(max)
  SELECT @sql = ' SELECT ProductID, ProductName, Description, UnitPrice, ImagePath' +
       ' FROM dbo.Products WHERE 1 = 1 '
       PRINT @sql
  IF @productName IS NOT NULL
     SELECT @sql = @sql + ' AND ProductName LIKE ''%' + @productName + '%'''
  IF @startPrice IS NOT NULL
     SELECT @sql = @sql + ' AND UnitPrice > ''' + CONVERT(VARCHAR(10),@startPrice) + ''''
  IF @endPrice IS NOT NULL
     SELECT @sql = @sql + ' AND UnitPrice < ''' + CONVERT(VARCHAR(10),@endPrice) + ''''

  PRINT @sql
  EXEC(@sql)
 END
```

### Example
Following is the same stored procedure implemented securely: 
```csharp
CREATE PROCEDURE [dbo].[uspGetProductsByCriteriaSecure]
(
             @productName nvarchar(200) = NULL,
             @startPrice float = NULL,
             @endPrice float = NULL
)
AS
       BEGIN
             SELECT ProductID, ProductName, Description, UnitPrice, ImagePath
             FROM dbo.Products where
             (@productName IS NULL or ProductName like '%'+ @productName +'%')
             AND
             (@startPrice IS NULL or UnitPrice > @startPrice)
             AND
             (@endPrice IS NULL or UnitPrice < @endPrice)         
       END
```

## <a id="validation-api"></a>Ensure that model validation is done on Web API methods

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web API | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | MVC5, MVC6 |
| **Attributes**              | N/A  |
| **References**              | [Model Validation in ASP.NET Web API](https://www.asp.net/web-api/overview/formats-and-model-binding/model-validation-in-aspnet-web-api) |
| **Steps** | When a client sends data to a web API, it is mandatory to validate the data before doing any processing. For ASP.NET Web APIs which accept models as input, use data annotations on models to set validation rules on the properties of the model.|

### Example
The following code demonstrates the same: 

```csharp
using System.ComponentModel.DataAnnotations;

namespace MyApi.Models
{
    public class Product
    {
        public int Id { get; set; }
        [Required]
        [RegularExpression(@"^[a-zA-Z0-9]*$", ErrorMessage="Only alphanumeric characters are allowed.")]
        public string Name { get; set; }
        public decimal Price { get; set; }
        [Range(0, 999)]
        public double Weight { get; set; }
    }
}
```

### Example
In the action method of the API controllers, validity of the model has to be explicitly checked as shown below: 

```csharp
namespace MyApi.Controllers
{
    public class ProductsController : ApiController
    {
        public HttpResponseMessage Post(Product product)
        {
            if (ModelState.IsValid)
            {
                // Do something with the product (not shown).

                return new HttpResponseMessage(HttpStatusCode.OK);
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }
    }
}
```

## <a id="string-api"></a>Implement input validation on all string type parameters accepted by Web API methods

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web API | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic, MVC 5, MVC 6 |
| **Attributes**              | N/A  |
| **References**              | [Validating Model Data in an MVC Application](https://msdn.microsoft.com/library/dd410404(v=vs.90).aspx), [Guiding Principles For Your ASP.NET MVC Applications](https://msdn.microsoft.com/magazine/dd942822.aspx) |
| **Steps** | For methods that just accept primitive data type, and not models as argument,input validation using Regular Expression should be done. Here Regex.IsMatch should be used with a valid regex pattern. If the input doesn't match the specified Regular Expression, control should not proceed further, and an adequate warning regarding validation failure should be displayed.|

## <a id="typesafe-api"></a>Ensure that type-safe parameters are used in Web API for data access

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web API | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | <p>If you use the Parameters collection, SQL treats the input is as a literal value rather then as executable code. The Parameters collection can be used to enforce type and length constraints on input data. Values outside of the range trigger an exception. If type-safe SQL parameters are not used, attackers might be able to execute injection attacks that are embedded in the unfiltered input.</p><p>Use type safe parameters when constructing SQL queries to avoid possible SQL injection attacks that can occur with unfiltered input. You can use type safe parameters with stored procedures and with dynamic SQL statements. Parameters are treated as literal values by the database and not as executable code. Parameters are also checked for type and length.</p>|

### Example
The following code shows how to use type safe parameters with the SqlParameterCollection when calling a stored procedure. 

```csharp
using System.Data;
using System.Data.SqlClient;

using (SqlConnection connection = new SqlConnection(connectionString))
{ 
DataSet userDataset = new DataSet(); 
SqlDataAdapter myCommand = new SqlDataAdapter("LoginStoredProcedure", connection); 
myCommand.SelectCommand.CommandType = CommandType.StoredProcedure; 
myCommand.SelectCommand.Parameters.Add("@au_id", SqlDbType.VarChar, 11); 
myCommand.SelectCommand.Parameters["@au_id"].Value = SSN.Text; 
myCommand.Fill(userDataset);
}  
```
In the preceding code example, the input value cannot be longer than 11 characters. If the data does not conform to the type or length defined by the parameter, the SqlParameter class throws an exception. 

## <a id="sql-docdb"></a>Use parameterized SQL queries for Cosmos DB

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Document DB | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Announcing SQL Parameterization in Azure Cosmos DB](https://azure.microsoft.com/blog/announcing-sql-parameterization-in-documentdb/) |
| **Steps** | Although Azure Cosmos DB only supports read-only queries, SQL injection is still possible if queries are constructed by concatenating with user input. It might be possible for a user to gain access to data they shouldn't be accessing within the same collection by crafting malicious SQL queries. Use parameterized SQL queries if queries are constructed based on user input. |

## <a id="schema-binding"></a>WCF Input validation through Schema binding

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | WCF | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic, NET Framework 3 |
| **Attributes**              | N/A  |
| **References**              | [MSDN](https://msdn.microsoft.com/library/ff647820.aspx) |
| **Steps** | <p>Lack of validation leads to different type injection attacks.</p><p>Message validation represents one line of defense in the protection of your WCF application. With this approach, you validate messages using schemas to protect WCF service operations from attack by a malicious client. Validate all messages received by the client to protect the client from attack by a malicious service. Message validation makes it possible to validate messages when operations consume message contracts or data contracts, which cannot be done using parameter validation. Message validation allows you to create validation logic inside schemas, thereby providing more flexibility and reducing development time. Schemas can be reused across different applications inside the organization, creating standards for data representation. Additionally, message validation allows you to protect operations when they consume more complex data types involving contracts representing business logic.</p><p>To perform message validation, you first build a schema that represents the operations of your service and the data types consumed by those operations. You then create a .NET class that implements a custom client message inspector and custom dispatcher message inspector to validate the messages sent/received to/from the service. Next, you implement a custom endpoint behavior to enable message validation on both the client and the service. Finally, you implement a custom configuration element on the class that allows you to expose the extended custom endpoint behavior in the configuration file of the service or the client"</p>|

## <a id="parameters"></a>WCF- Input validation through Parameter Inspectors

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | WCF | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic, NET Framework 3 |
| **Attributes**              | N/A  |
| **References**              | [MSDN](https://msdn.microsoft.com/library/ff647875.aspx) |
| **Steps** | <p>Input and data validation represents one important line of defense in the protection of your WCF application. You should validate all parameters exposed in WCF service operations to protect the service from attack by a malicious client. Conversely, you should also validate all return values received by the client to protect the client from attack by a malicious service</p><p>WCF provides different extensibility points that allow you to customize the WCF runtime behavior by creating custom extensions. Message Inspectors and Parameter Inspectors are two extensibility mechanisms used to gain greater control over the data passing between a client and a service. You should use parameter inspectors for input validation and use message inspectors only when you need to inspect the entire message flowing in and out of a service.</p><p>To perform input validation, you will build a .NET class and implement a custom parameter inspector in order to validate parameters on operations in your service. You will then implement a custom endpoint behavior to enable validation on both the client and the service. Finally, you will implement a custom configuration element on the class that allows you to expose the extended custom endpoint behavior in the configuration file of the service or the client</p>|
