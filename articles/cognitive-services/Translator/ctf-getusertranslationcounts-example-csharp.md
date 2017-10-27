---
title: C# GetUserTranslationCounts Example | Microsoft Docs
description: 
services: cognitive-services
author: jann-skotdal
manager: olivierf

ms.service: cognitive-services
ms.technology: translator
ms.topic: article
ms.date: 10/27/2017
ms.author: v-jansko
---

**C#**
```
using System;
using System.IO;
using System.Net;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Web;

namespace CtfReporting
{
    class Program
    {
        static void Main(string[] args)
        {
            AdmAccessToken admToken;
            string headerValue;
            //Get Client Id and Client Secret from https://datamarket.azure.com/developer/applications/
            //Refer obtaining AccessToken (http://msdn.microsoft.com/en-us/library/hh454950.aspx) 
            AdmAuthentication admAuth = new AdmAuthentication("clientId", "clientSecret");
            try
            {
                admToken = admAuth.GetAccessToken();
                // Create a header with the access_token property of the returned token
                headerValue = "Bearer " + admToken.access_token;
                Console.WriteLine("User translations count");
                ctfGetUserTranslationsCount(headerValue, 0, 5);
                Console.WriteLine("Press Enter for Next 5 Records");
                if (Console.ReadKey().Key == ConsoleKey.Enter)
                {
                    ctfGetUserTranslationsCount(headerValue, 5, 5);
                    Console.WriteLine("Press any key to exit...");
                    Console.ReadKey(true);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine("Press any key to exit...");
                Console.ReadKey(true);
            }
        }
        private static void ctfGetUserTranslationsCount(string authToken, int skip, int take)
        {
            // Add CtfReportingService as a service reference, Address:http://api.microsofttranslator.com/v2/beta/ctfreporting.svc
            CtfReportingService.CtfReportingServiceClient reportingClient = new CtfReportingService.CtfReportingServiceClient();
            CtfReportingService.UserTranslationCount[] userTranslationsCount = reportingClient.GetUserTranslationCounts(authToken, "", "es", "en", null, null, "", "general", null, null, skip, take);
            foreach (CtfReportingService.UserTranslationCount item in userTranslationsCount)
            {
                Console.WriteLine(string.Format("Count={0},From={1},To={2},Rating={3},Uri={4},User={5}", item.Count, item.From, item.To, item.Rating, item.Uri, item.User));
            }
        }
    }
    [DataContract]
    public class AdmAccessToken
    {
        [DataMember]
        public string access_token { get; set; }
        [DataMember]
        public string token_type { get; set; }
        [DataMember]
        public string expires_in { get; set; }
        [DataMember]
        public string scope { get; set; }
    }

    public class AdmAuthentication
    {
        public static readonly string DatamarketAccessUri = "https://datamarket.accesscontrol.windows.net/v2/OAuth2-13";
        private string clientId;
        private string cientSecret;
        private string request;

        public AdmAuthentication(string clientId, string clientSecret)
        {
            this.clientId = clientId;
            this.cientSecret = clientSecret;
            //If clientid or client secret has special characters, encode before sending request
            this.request = string.Format("grant_type=client_credentials&client_id={0}&client_secret={1}&scope=http://api.microsofttranslator.com", HttpUtility.UrlEncode(clientId), HttpUtility.UrlEncode(clientSecret));
        }

        public AdmAccessToken GetAccessToken()
        {
            return HttpPost(DatamarketAccessUri, this.request);
        }

        private AdmAccessToken HttpPost(string DatamarketAccessUri, string requestDetails)
        {
            //Prepare OAuth request 
            WebRequest webRequest = WebRequest.Create(DatamarketAccessUri);
            webRequest.ContentType = "application/x-www-form-urlencoded";
            webRequest.Method = "POST";
            byte[] bytes = Encoding.ASCII.GetBytes(requestDetails);
            webRequest.ContentLength = bytes.Length;
            using (Stream outputStream = webRequest.GetRequestStream())
            {
                outputStream.Write(bytes, 0, bytes.Length);
            }
            using (WebResponse webResponse = webRequest.GetResponse())
            {
                DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(AdmAccessToken));
                //Get deserialized object from JSON stream
                AdmAccessToken token = (AdmAccessToken)serializer.ReadObject(webResponse.GetResponseStream());
                return token;
            }
        }
    }
}
```  