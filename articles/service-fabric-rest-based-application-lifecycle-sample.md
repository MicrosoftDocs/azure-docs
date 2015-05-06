<properties
   pageTitle="REST-Based Application Lifecycle Sample"
   description="REST-Based Application Lifecycle Sample"
   services="service-fabric"
   documentationCenter=".net"
   authors="v-roharp@microsoft.com"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="5/5/2015"
   ms.author="v-roharp@microsoft.com"/>

# REST-Based Application Lifecycle Sample

This sample demonstrates the Service Fabric application lifecycle through REST API calls. For more information on the Service Fabric application lifecycle, see [Service Fabric Application Lifecycle](service-fabric-application-lifecycle.md).

## Prerequisites

This sample requires two applications in the ImageStore.

|Folder|Description|
|------|-----------|
|WordCount|The WordCount sample application. The ApplicationManifest.xml contains ApplicationTypeVersion="1.0.0.0".|
|WordCountUpgrade|The WordCount sample application. The ApplicationManifest.xml file must be changed to ApplicationTypeVersion="1.1.0.0" to allow the application upgrade to occur.|

## Description

This sample performs the following:

* Provisions the WordCount 1.0.0.0 sample from the WordCount application package in the ImageStore.
* Displays the list of application types, which includes WordCount 1.0.0.0.
* Creates the WordCount application as fabric:/WordCount.
* Displays the list of applications, which includes fabric:/WordCount version 1.0.0.0.
* Provisions the 1.1.0.0 version of the WordCount sample from the WordCountUpgrade application package in the ImageStore.
* Displays the list of application types, which includes both WordCount 1.0.0.0 and WordCount 1.1.0.0.
* Upgrades the WordCount application to version 1.1.0.0.
* Displays the list of applications, which includes WordCount version 1.1.0.0, but no longer includes WordCount version 1.0.0.0.
* Deletes the WordCount application.
* Displays the list of applications, which no longer includes fabric:/WordCount.
* Unprovisions the 1.1.0.0 version of the WordCount sample.
* Displays the list of application types, which includes WordCount 1.0.0.0, but no longer includes WordCount 1.1.0.0.
* Unprovisions the 1.0.0.0 version of the WordCount sample.
* Displays the list of application types, which no longer includes WordCount.

## Example

The following example demonstrates the Service Fabric application lifecycle.

```csharp
using System;
using System.Collections.Generic;
using System.Fabric;
using System.Fabric.Description;
using System.Fabric.Health;
using System.Fabric.Query;
using System.IO;
using System.Net;
using System.Text;
using System.Web.Script.Serialization;

/*********************************************************************************************************

    This sample demonstrates  the Service Fabric application lifecycle. A Service Fabric Application 
        is provisioned, created, updated, deleted, and unprovisioned.

    This requires two applications in the ImageStore:
        WordCount        - The WordCount sample.
        WordCountUpgrade - The WordCount sample with an altered ApplicationManifest.xml which has 
                           ApplicationTypeVersion="1.1.0.0".


    To create the application packages and copy them to the ImageStore, take the following steps:

    1) Copy C:\Samples\Services\VS2015\WordCountUpgrade\WordCount\pkg\Debug to C:\Temp\WordCount.
        This creates the WordCount application package.

    2) Copy C:\Temp\WordCount to C:\Temp\WordCountUpgrade.
        This creates the WordCountUpgrade application package.

    3) Open C:\Temp\WordCountUpgrade\ApplicationManifest.xml in a text editor.

    4) In the ApplicationManifest element, change the ApplicationTypeVersion attribute to "1.1.0.0".
        This updates the version number of the application.

    5) Save the changed ApplicationManifest.xml file.

    6) Run the following PowerShell script as an administrator to copy the applications to the ImageStore:

        # Deploy the WordCount and upgrade applications
        $applicationPathWordCount = "C:\Temp\WordCount"
        $applicationPathUpgrade = "C:\Temp\WordCountUpgrade"

        # LOCAL:
        $imageStoreConnection = "fabric:ImageStore"
        $cluster = 'localhost:19000'

        Connect-ServiceFabricCluster $cluster

        Copy-ServiceFabricApplicationPackage -ApplicationPackagePath $applicationPathWordCount -ImageStoreConnectionString $imageStoreConnection
        Copy-ServiceFabricApplicationPackage -ApplicationPackagePath $applicationPathUpgrade -ImageStoreConnectionString $imageStoreConnection

    After the PowerShell script completes, this application will be ready to run.

*********************************************************************************************************/


namespace ServiceFabricRestCaller
{
    class Program
    {
        static void Main(string[] args)
        {
            Uri clusterUri = new Uri("http://localhost:19007");
            string buildPathApplication = "WordCount";
            string applicationVersionNumber = "1.0.0.0";
            string buildPathUpgrade = "WordCountUpgrade";
            string updateVersionNumber = "1.1.0.0";


            Console.WriteLine("\nProvision the 1.0.0.0 WordCount application for the first time.");
            ProvisionAnApplication(clusterUri, buildPathApplication);
            Console.WriteLine("\nPress Enter to get the list of application types: ");
            Console.ReadLine();


            Console.WriteLine("\nGet the list of application types.");
            GetListOfApplicationTypes(clusterUri);
            Console.WriteLine("\nPress Enter to create the fabric:/WordCount application: ");
            Console.ReadLine();


            Console.WriteLine("\nCreate the fabric:/WordCount application.");
            CreateApplication(clusterUri);
            Console.WriteLine("\nPress Enter to get the list of applications: ");
            Console.ReadLine();


            Console.WriteLine("\nGet the list of applications.");
            GetApplicationList(clusterUri);
            Console.WriteLine("\nPress Enter to provision the 1.1.0.0 upgrade to the WordCount application: ");
            Console.ReadLine();


            Console.WriteLine("\nProvision the 1.1.0.0 upgrade to the WordCount application.");
            ProvisionAnApplication(clusterUri, buildPathUpgrade);
            Console.WriteLine("\nPress Enter to get the list of application types: ");
            Console.ReadLine();


            Console.WriteLine("\nGet the list of application types.");
            GetListOfApplicationTypes(clusterUri);
            Console.WriteLine("\nPress Enter to upgrade the fabric:/WordCount application: ");
            Console.ReadLine();


            Console.WriteLine("\nUpgrade the fabric:/WordCount application.");
            UpgradeApplicationByApplicationType(clusterUri);
            Console.WriteLine("\nPress Enter to get the list of applications: ");
            Console.ReadLine();


            Console.WriteLine("\nGet the list of applications.");
            GetApplicationList(clusterUri);
            Console.WriteLine("\nPress Enter to delete the fabric:/WordCount application: ");
            Console.ReadLine();


            Console.WriteLine("\nDelete the fabric:/WordCount application.");
            DeleteApplication(clusterUri);
            Console.WriteLine("\nPress Enter to get the list of applications: ");
            Console.ReadLine();


            Console.WriteLine("\nGet the list of applications.");
            GetApplicationList(clusterUri);
            Console.WriteLine("\nPress Enter to unprovision the WordCount 1.1.0.0 application: ");
            Console.ReadLine();


            Console.WriteLine("\nUnprovision the WordCount 1.1.0.0 application.");
            UnprovisionAnApplication(clusterUri, updateVersionNumber);
            Console.WriteLine("\nPress Enter to get the list of application types: ");
            Console.ReadLine();


            Console.WriteLine("\nGet the list of application types.");
            GetListOfApplicationTypes(clusterUri);
            Console.WriteLine("\nPress Enter to unprovision the WordCount 1.0.0.0 application: ");
            Console.ReadLine();


            Console.WriteLine("\nUnprovision the WordCount 1.0.0.0 application.");
            UnprovisionAnApplication(clusterUri, applicationVersionNumber);
            Console.WriteLine("\nPress Enter to get the final list of application types: ");
            Console.ReadLine();


            Console.WriteLine("\nGet the final list of application types.");
            GetListOfApplicationTypes(clusterUri);
            Console.WriteLine("\nPress Enter to end this program: ");
            Console.ReadLine();
        }

        /*
        This code produces output similar to the following:

        Provision the 1.0.0.0 WordCount application for the first time.
        Provision an Application response status = OK

        Press Enter to get the list of application types:


        Get the list of application types.
        Application types:
          Application Type:
            Name: WordCount
            Version: 1.0.0.0
            Default Parameter List:

        Press Enter to create the fabric:/WordCount application:


        Create the fabric:/WordCount application.
        Create Application response status = Created

        Press Enter to get the list of applications:


        Get the list of applications.
        Application List:
          Application:
            Id: WordCount
            Name: fabric:/WordCount
            TypeName: WordCount
            TypeVersion: 1.0.0.0
            Status: Ready
            HealthState: Ok
            Parameters:

        Press Enter to provision the 1.1.0.0 upgrade to the WordCount application:


        Provision the 1.1.0.0 upgrade to the WordCount application.
        Provision an Application response status = OK

        Press Enter to get the list of application types:


        Get the list of application types.
        Application types:
          Application Type:
            Name: WordCount
            Version: 1.0.0.0
            Default Parameter List:
          Application Type:
            Name: WordCount
            Version: 1.1.0.0
            Default Parameter List:

        Press Enter to upgrade the fabric:/WordCount application:


        Upgrade the fabric:/WordCount application.
        Update Application response status = OK

        Press Enter to get the list of applications:


        Get the list of applications.
        Application List:
          Application:
            Id: WordCount
            Name: fabric:/WordCount
            TypeName: WordCount
            TypeVersion: 1.1.0.0
            Status: Ready
            HealthState: Ok
            Parameters:

        Press Enter to delete the fabric:/WordCount application:


        Delete the fabric:/WordCount application.
        Delete Application response status = OK

        Press Enter to get the list of applications:


        Get the list of applications.
        Application List:

        Press Enter to unprovision the WordCount 1.1.0.0 application:


        Unprovision the WordCount 1.1.0.0 application.
        Unprovision an Application response status = OK

        Press Enter to get the list of application types:


        Get the list of application types.
        Application types:
          Application Type:
            Name: WordCount
            Version: 1.0.0.0
            Default Parameter List:

        Press Enter to unprovision the WordCount 1.0.0.0 application:


        Unprovision the WordCount 1.0.0.0 application.
        Unprovision an Application response status = OK

        Press Enter to get the final list of application types:


        Get the final list of application types.
        Application types:

        Press Enter to end this program:

        */


        #region Classes

        /// <summary>
        /// Class similar to ApplicationType. Designed for use with JavaScriptSerializer.
        /// </summary>
        public class ApplicationType2
        {
            public string Name { get; set; }
            public string Version { get; set; }
            public ApplicationParameterList DefaultParameterList { get; set; }
        }

        /// <summary>
        /// Class designed for use with JavaScriptSerializer.
        /// </summary>
        public class ApplicationInfo
        {
            public string Id { get; set; }
            public string Name { get; set; }
            public string TypeName { get; set; }
            public string TypeVersion { get; set; }
            public ApplicationStatus Status { get; set; }
            public List<Parameter> Parameters { get; set; }
            public HealthState HealthState { get; set; }
        }

        /// <summary>
        /// Class similar to Parameter. Designed for use with JavaScriptSerializer.
        /// </summary>
        public class Parameter
        {
            public string Name { get; set; }
            public string Value { get; set; }
        }

        #endregion


        #region Get List of Application Types (REST API)

        /// <summary>
        /// Gets the list of application types.
        /// </summary>
        /// <param name="clusterUri">The URI to access the cluster.</param>
        /// <returns>Returns true if successful; otherwise false.</returns>
        public static bool GetListOfApplicationTypes(Uri clusterUri)
        {
            // String to capture the response stream.
            string responseString = string.Empty;

            // Create the request and add URL parameters.
            Uri requestUri = new Uri(clusterUri, string.Format("/ApplicationTypes?api-version={0}",
            "1.0"));    // api-version

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(requestUri);
            request.Method = "GET";

            // Execute the request and obtain the response.
            try
            {
                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                {
                    using (StreamReader streamReader = new StreamReader(response.GetResponseStream(), true))
                    {
                        // Capture the response string.
                        responseString = streamReader.ReadToEnd();
                    }
                }
            }
            catch (WebException e)
            {
                // If there is a web exception, display the error message.
                Console.WriteLine("Error getting the list of application types:");
                Console.WriteLine(e.Message);
                if (e.InnerException != null)
                    Console.WriteLine(e.InnerException.Message);
                return false;
            }
            catch (Exception e)
            {
                // If there is another kind of exception, throw it.
                throw (e);
            }

            // Deserialize the response string.
            JavaScriptSerializer jss = new JavaScriptSerializer();
            List<ApplicationType2> applicationTypes = jss.Deserialize<List<ApplicationType2>>(responseString);

            // Display application type information for each application type.
            Console.WriteLine("Application types:");
            foreach (ApplicationType2 applicationType in applicationTypes)
            {
                Console.WriteLine("  Application Type:");
                Console.WriteLine("    Name: " + applicationType.Name);
                Console.WriteLine("    Version: " + applicationType.Version);
                Console.WriteLine("    Default Parameter List:");

                foreach (ApplicationParameter parameter in applicationType.DefaultParameterList)
                {
                    Console.WriteLine("      Name: " + parameter.Name);
                    Console.WriteLine("      Value: " + parameter.Value);
                }
            }

            return true;
        }

        /* This code produces output similar to the following:

        Application types:
            Application Type:
            Name: WordCount
            Version: 1.0.0.0
            Default Parameter List:
        */

        /* Sample JSON return string (formatted): 
        [
            {
                "Name": "WordCount",
                "Version": "1.0.0.0",
                "DefaultParameterList": []
            }
        ]
        */

        #endregion


        #region Provision an Application (REST API)

        /// <summary>
        /// Provisions an application to the image store.
        /// </summary>
        /// <param name="clusterUri">The URI to access the cluster.</param>
        /// <param name="applicationTypeBuildPath">The application type build path ("WordCount" or "WordCountUpgrade").</param>
        /// <returns>Returns true if successful; otherwise false.</returns>
        public static bool ProvisionAnApplication(Uri clusterUri, string applicationTypeBuildPath)
        {
            // Create the request and add URL parameters.
            Uri requestUri = new Uri(clusterUri, string.Format("/ApplicationTypes/$/Provision?api-version={0}",
                "1.0"));    // api-version

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(requestUri);
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";

            // Create the byte array that will become the request body.
            string requestBody = "{\"ApplicationTypeBuildPath\":\"" + applicationTypeBuildPath + "\"}";
            byte[] requestBodyBytes = Encoding.UTF8.GetBytes(requestBody);
            request.ContentLength = requestBodyBytes.Length;

            // Stores the response status code.
            HttpStatusCode statusCode;

            // Create the request body.
            try
            {
                using (Stream requestStream = request.GetRequestStream())
                {
                    requestStream.Write(requestBodyBytes, 0, requestBodyBytes.Length);
                    requestStream.Close();

                    // Execute the request and obtain the response.
                    using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                    {
                        statusCode = response.StatusCode;
                    }
                }
            }
            catch (WebException e)
            {
                // If there is a web exception, display the error message.
                Console.WriteLine("Error provisioning the application:");
                Console.WriteLine(e.Message);
                if (e.InnerException != null)
                    Console.WriteLine(e.InnerException.Message);
                return false;
            }
            catch (Exception e)
            {
                // If there is another kind of exception, throw it.
                throw (e);
            }

            Console.WriteLine("Provision an Application response status = " + statusCode.ToString());
            return true;
        }

        /*
        This code produces output similar to the following:

        Provision an Application response status = OK
        */

        /* JSON request string (formatted): 
        {
            "ApplicationTypeBuildPath": "WordCount"
        }
        */

        #endregion


        #region Unprovision an Application (REST API)

        /// <summary>
        /// Unprovisions an application.
        /// </summary>
        /// <param name="clusterUri">The URI to access the cluster.</param>
        /// <returns>Returns true if successful; otherwise false.</returns>
        public static bool UnprovisionAnApplication(Uri clusterUri, string versionToUnprovision)
        {
            // Create the request and add URL parameters.
            Uri requestUri = new Uri(clusterUri, string.Format("/ApplicationTypes/{0}/$/Unprovision?api-version={1}",
                "WordCount",     // Application Type Name
                "1.0"));            // api-version

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(requestUri);
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";

            // Stores the response status code.
            HttpStatusCode statusCode;

            // Create the byte array that will become the request body.
            string requestBody = "{\"ApplicationTypeVersion\":\"" + versionToUnprovision + "\"}";
            byte[] requestBodyBytes = Encoding.UTF8.GetBytes(requestBody);
            request.ContentLength = requestBodyBytes.Length;

            // Create the request body.
            try
            {
                using (Stream requestStream = request.GetRequestStream())
                {
                    requestStream.Write(requestBodyBytes, 0, requestBodyBytes.Length);
                    requestStream.Close();

                    // Execute the request and obtain the response.
                    using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                    {
                        statusCode = response.StatusCode;
                    }
                }
            }
            catch (WebException e)
            {
                // If there is a web exception, display the error message.
                Console.WriteLine("Error unprovisioning the application:");
                Console.WriteLine(e.Message);
                if (e.InnerException != null)
                    Console.WriteLine(e.InnerException.Message);
                return false;
            }
            catch (Exception e)
            {
                // If there is another kind of exception, throw it.
                throw (e);
            }

            Console.WriteLine("Unprovision an Application response status = " + statusCode.ToString());
            return true;
        }

        /*
        This code produces output similar to the following:

        Unprovision an Application response status = OK
        */

        /* JSON request string (formatted):
        {
            "ApplicationTypeVersion":"1.0.0.0"
        }
        */

        #endregion


        #region Get Application List (REST API)

        /// <summary>
        /// Gets the list of applications.
        /// </summary>
        /// <param name="clusterUri">The URI to access the cluster.</param>
        /// <returns>Returns true if successful; otherwise false.</returns>
        public static bool GetApplicationList(Uri clusterUri)
        {
            // String to capture the response stream.
            string responseString = string.Empty;

            // Create the request and add URL parameters.
            Uri requestUri = new Uri(clusterUri, string.Format("/Applications?api-version={0}",
                "1.0")); // api-version

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(requestUri);
            request.Method = "GET";

            // Execute the request and obtain the response.
            try
            {
                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                {
                    using (StreamReader streamReader = new StreamReader(response.GetResponseStream(), true))
                    {
                        // Capture the response string.
                        responseString = streamReader.ReadToEnd();
                    }
                }
            }
            catch (WebException e)
            {
                // If there is a web exception, display the error message.
                Console.WriteLine("Error getting the application list:");
                Console.WriteLine(e.Message);
                if (e.InnerException != null)
                    Console.WriteLine(e.InnerException.Message);
                return false;
            }
            catch (Exception e)
            {
                // If there is another kind of exception, throw it.
                throw (e);
            }


            // Deserialize the response string.
            JavaScriptSerializer jss = new JavaScriptSerializer();
            List<ApplicationInfo> applicationInfos = jss.Deserialize<List<ApplicationInfo>>(responseString);

            // Display some application information for each application.
            Console.WriteLine("Application List:");
            foreach (ApplicationInfo applicationInfo in applicationInfos)
            {
                Console.WriteLine("  Application:");
                Console.WriteLine("    Id: " + applicationInfo.Id);
                Console.WriteLine("    Name: " + applicationInfo.Name);
                Console.WriteLine("    TypeName: " + applicationInfo.TypeName);
                Console.WriteLine("    TypeVersion: " + applicationInfo.TypeVersion);
                Console.WriteLine("    Status: " + applicationInfo.Status);
                Console.WriteLine("    HealthState: " + applicationInfo.HealthState);

                Console.WriteLine("    Parameters:");

                foreach (Parameter parameter in applicationInfo.Parameters)
                {
                    Console.WriteLine("      Parameter:");
                    Console.WriteLine("        Name: " + parameter.Name);
                    Console.WriteLine("        Value: " + parameter.Value);
                }
            }

            return true;
        }

        /* This code produces output similar to the following:

        Application List:
            Application:
            Id: WordCount
            Name: fabric:/WordCount
            TypeName: WordCount
            TypeVersion: 1.0.0.0
            Status: Ready
            HealthState: Ok
            Parameters:
        */

        /* Sample JSON return string (formatted): 
        [
            {
                "Id": "WordCount",
                "Name": "fabric:\\/WordCount",
                "TypeName": "WordCount",
                "TypeVersion": "1.0.0.0",
                "Status": 1,
                "Parameters": [],
                "HealthState": 1
            }
        ]
        */

        #endregion


        #region Create Application (REST API)

        /// <summary>
        /// Creates an application.
        /// </summary>
        /// <param name="clusterUri">The URI to access the cluster.</param>
        /// <returns>Returns true if successful; otherwise false.</returns>
        public static bool CreateApplication(Uri clusterUri)
        {
            // String to capture the response stream.
            string responseString = string.Empty;

            // Stores the response status code.
            HttpStatusCode statusCode;

            // Create the request and add URL parameters.
            Uri requestUri = new Uri(clusterUri, string.Format("/Applications/$/Create?api-version={0}",
                "1.0"));    // api-version

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(requestUri);
            request.ContentType = "text/json";
            request.Method = "POST";

            // Create the byte array that will become the request body.
            string requestBody = "{\"Name\":\"fabric:/WordCount\"," +
                                    "\"TypeName\":\"WordCount\"," +
                                    "\"TypeVersion\":\"1.0.0.0\"," +
                                    "\"ParameterList\":[]}";
            byte[] requestBodyBytes = Encoding.UTF8.GetBytes(requestBody);
            request.ContentLength = requestBodyBytes.Length;

            // Create the request body.
            try
            {
                using (Stream requestStream = request.GetRequestStream())
                {
                    requestStream.Write(requestBodyBytes, 0, requestBodyBytes.Length);
                    requestStream.Close();

                    // Execute the request and obtain the response.
                    using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                    {
                        statusCode = response.StatusCode;
                    }
                }
            }
            catch (WebException e)
            {
                // If there is a web exception, display the error message.
                Console.WriteLine("Error creating application:");
                Console.WriteLine(e.Message);
                if (e.InnerException != null)
                    Console.WriteLine(e.InnerException.Message);
                return false;
            }
            catch (Exception e)
            {
                // If there is another kind of exception, throw it.
                throw (e);
            }

            Console.WriteLine("Create Application response status = " + statusCode.ToString());

            return true;
        }

        /* This code produces output similar to the following:

        Create Application response status = Created
        */

        /* JSON request string (formatted): 
        {
            "Name": "fabric:/WordCount",
            "TypeName": "WordCount",
            "TypeVersion": "1.0.0.0",
            "ParameterList": []
        }
        */

        #endregion


        #region Delete Application (REST API)

        /// <summary>
        /// Deletes an application.
        /// </summary>
        /// <param name="clusterUri">The URI to access the cluster.</param>
        /// <returns>Returns true if successful; otherwise false.</returns>
        public static bool DeleteApplication(Uri clusterUri)
        {
            // Create the request and add URL parameters.
            Uri requestUri = new Uri(clusterUri,
                string.Format("/Applications/{0}/$/Delete?api-version={1}",
                "WordCount",    // Application Name
                "1.0"));        // api-version

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(requestUri);
            request.Method = "POST";
            request.ContentLength = 0;

            // Stores the response status code.
            HttpStatusCode statusCode;

            // Execute the request and obtain the response.
            try
            {
                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                {
                    statusCode = response.StatusCode;
                }
            }
            catch (WebException e)
            {
                // If there is a web exception, display the error message.
                Console.WriteLine("Error deleting application:");
                Console.WriteLine(e.Message);
                if (e.InnerException != null)
                    Console.WriteLine(e.InnerException.Message);
                return false;
            }
            catch (Exception e)
            {
                // If there is another kind of exception, throw it.
                throw (e);
            }

            Console.WriteLine("Delete Application response status = " + statusCode.ToString());

            return true;
        }

        /* This code produces output similar to the following:

        Delete Application response status = OK
        */

        #endregion


        #region Upgrade Application by Application Type (REST API)

        /// <summary>
        /// Upgrades an application by application type.
        /// </summary>
        /// <param name="clusterUri">The URI to access the cluster.</param>
        /// <returns>Returns true if successful; otherwise false.</returns>
        public static bool UpgradeApplicationByApplicationType(Uri clusterUri)
        {
            // String to capture the response stream.
            string responseString = string.Empty;

            // Stores the response status code.
            HttpStatusCode statusCode;

            // Create the request and add URL parameters.
            Uri requestUri = new Uri(clusterUri, string.Format("/Applications/{0}/$/Upgrade?api-version={1}",
                "WordCount",     // Application Name
                "1.0"));                // api-version

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(requestUri);
            request.ContentType = "text/json";
            request.Method = "POST";


            // Create the Health Policy.
            string requestBody = "{\"Name\":\"fabric:/WordCount\"," +
                                    "\"TargetApplicationTypeVersion\":\"1.1.0.0\"," +
                                    "\"Parameters\":[]," +
                                    "\"UpgradeKind\":1," +
                                    "\"RollingUpgradeMode\":1," +
                                    "\"UpgradeReplicaSetCheckTimeoutInSeconds\":5," +
                                    "\"ForceRestart\":true," +
                                    "\"MonitoringPolicy\":" +
                                    "{\"FailureAction\":1," +
                                    "\"HealthCheckWaitDurationInMilliseconds\":\"5000\"," +
                                    "\"HealthCheckStableDurationInMilliseconds\":\"10000\"," +
                                    "\"HealthCheckRetryTimeoutInMilliseconds\":\"20000\"," +
                                    "\"UpgradeTimeoutInMilliseconds\":\"60000\"," +
                                    "\"UpgradeDomainTimeoutInMilliseconds\":\"30000\"}}";

            // Create the byte array that will become the request body.
            byte[] requestBodyBytes = Encoding.UTF8.GetBytes(requestBody);
            request.ContentLength = requestBodyBytes.Length;

            // Create the request body.
            try
            {
                using (Stream requestStream = request.GetRequestStream())
                {
                    requestStream.Write(requestBodyBytes, 0, requestBodyBytes.Length);
                    requestStream.Close();

                    // Execute the request and obtain the response.
                    using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                    {
                        statusCode = response.StatusCode;
                    }
                }
            }
            catch (WebException e)
            {
                // If there is a web exception, display the error message.
                Console.WriteLine("Error upgrading application:");
                Console.WriteLine(e.Message);
                if (e.InnerException != null)
                    Console.WriteLine(e.InnerException.Message);
                return false;
            }
            catch (Exception e)
            {
                // If there is another kind of exception, throw it.
                throw (e);
            }

            Console.WriteLine("Update Application response status = " + statusCode.ToString());

            return true;
        }

        /* This code produces output similar to the following:

        Update Application response status = OK
        */

        /* JSON request string (formatted): 
        {
            "Name": "fabric:/WordCount",
            "TargetApplicationTypeVersion": "1.1.0.0",
            "Parameters": [],
            "UpgradeKind": 1,
            "RollingUpgradeMode": 1,
            "UpgradeReplicaSetCheckTimeoutInSeconds": 5,
            "ForceRestart": true,
            "MonitoringPolicy": {
                "FailureAction": 1,
                "HealthCheckWaitDurationInMilliseconds": "5000",
                "HealthCheckStableDurationInMilliseconds": "10000",
                "HealthCheckRetryTimeoutInMilliseconds": "20000",
                "UpgradeTimeoutInMilliseconds": "60000",
                "UpgradeDomainTimeoutInMilliseconds": "30000"
            }
        }
        */

        #endregion
    }
}
```


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

[Service Fabric Application Lifecycle](service-fabric-application-lifecycle.md)

