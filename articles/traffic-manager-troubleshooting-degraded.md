<properties 
   pageTitle="Troubleshooting Degraded status on Azure Traffic Manager
   description="How to troubleshoot Traffic Manager profiles when it shows as degraded status.This is a guidance to understand the probing mechanism how it checks for the endpoint health"
   services="traffic-manager"
   documentationCenter=""
   authors="joaoma"
   manager="adinah"
   editor="tysonn" />
<tags 
   ms.service="traffic-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="05/27/2015"
   ms.author="joaoma;cherylmc" />
# Troubleshooting Degraded status on Azure Traffic Manager
This page will describe how to troubleshoot Azure Traffic Manager profile which is showing a Degraded status, and provide some key points to understand about traffic manager probes.

 

## Symptom

You have configured a Windows Azure Traffic Manager profile pointing to some of your .cloudapp.net hosted services and after a few seconds you see the Status as Degraded.


If you go into the Endpoints tab of that profile you will see one or more of the endpoints in an Offline status:



 

 

Important notes about WATM probing
•WATM only considers an endpoint as ONLINE if the probe gets a 200 back from the probe path.
•A 30x redirect (or any other non-200 response) will fail, even if the redirected URL returns a 200.
•For HTTPs probes, certificate errors are ignored.
•The actual content of the probe path doesn’t matter, as long as a 200 is returned.  A common technique if the actual website content doesn’t return a 200 (ie. if the ASP pages redirect to an ACS login page or some other CNAME URL) is to set the path to something like “/favicon.ico”.
•Best practice is to set the Probe path to something which has enough logic to determine if the site is up or down.  In the above example setting the path to “/favicon.ico” you are only testing if w3wp.exe is responding, but not if your website is healthy.  A better option would be to set a path to something such as “/Probe.aspx”, and within Probe.aspx include enough logic to determine if your site is healthy (ie. check perf counters to make sure you aren’t at 100% CPU or receiving a large number of failed requests, attempt to access resources such as the database or session state to make sure the application’s logic is working, etc).
•If all endpoints in a profile are degraded then WATM will treat all endpoints as healthy and route traffic to all endpoints.  This is to ensure that any potential problem with the probing mechanism which results in incorrectly failed probes will not result in a complete outage of your service.

  

Troubleshooting

The best tool for troubleshooting WATM probe failures is wget.  You can get the binaries and dependencies package from http://gnuwin32.sourceforge.net/packages/wget.htm.  Note that you can use other programs such as Fiddler or curl instead of wget – basically you just need something that will show you the raw HTTP response.

Once you have wget installed, go to a command prompt and run wget against the URL + Probe port & path that is configured in WATM.  For this example it would be http://watestsdp2008r2.cloudapp.net:80/Probe.

image

 

image

 

Notice that wget indicates that the URL returned a 301 redirect to http://watestsdp2008r2.cloudapp.net/Default.aspx.  As we know from the “Important notes about WATM probing” section above, a 30x redirect is considered a failure by WATM probing and this will cause the probe to report Offline.  At this point it is a simple matter to check the website configuration and make sure that a 200 is returned from the /Probe path (or reconfigure the WATM probe to point to a path which will return a 200).

 

If your probe is using HTTPs protocol you will want to add the “--no-check-certificate” parameter to wget so that it will ignore the certificate mismatch on the cloudapp.net URL.
