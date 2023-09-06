---
title: 'General performance troubleshooting of Azure Front Door'
titleSuffix: Azure Front Door
description: In this article, investigate, diagnose and resolve potential latency or bandwidth issues associated with an Azure Front Door related site performance
services: frontdoor
author: sbdoroff
ms.service: frontdoor
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 08/30/2023
ms.author: stdoroff
#Customer intent: As a <type of user>, I want <some goal> so that <some reason>.
---

# Azure Front Door Performance 

Performance issues can originate in several potential areas.  This troubleshooting guide helps identify which hop along the data-path is most likely the root of the issue and how to resolve.  As a brief overview, the issue could be at the Azure Front Door, the origin, the requesting client or the path between any of these hops.

## Check for Known Issues

Before beginning, be sure to check for any known issues on the [Azure Front Door platform](https://azure.status.microsoft/status), ISPs in the path or the requesting client's ability to connect and retrieve data.

## Scenario 1: Investigate the Origin

If one of the origin servers are slow, then the first request for an object via the Azure Front Door is slow.  Further, if the content isn't cached at the Azure Front Door's Point of Presence (POP), requests are forwarded to the origin.  Serving from the origin negates the benefit of the POP's proximity and local delivery to the requesting client, and, instead, rely on the origin's performance.

### Scenario 1 | Environment Information Needed

- Azure Front Door / Endpoint Name
  - Endpoint Hostname
  - Endpoint Custom Domain (if applicable)
  - Origin Hostname
- Full URL of Affected File

### Scenario 1 | Troubleshooting Steps

1. Check the response headers from the affected request  

    > [!TIP]
    > To check response headers, examples using `curl` in Bash are below. Your browser's developer tools (F12) can also be used.  For browser's developer tools, select the *Networking* tab, then the relevant file to be investigated, then the *Headers* tab. ***If the file is missing*** the page need to be reloaded with developer tools (F12) open.
     
    - The initial response should have an *x-cache* header with *TCP_MISS* value
    - Requests with this value are forwarded by the Azure Front Door's POP to the origin. The origin sends the return traffic on that same path to the requesting client.
    - Examples
      - TCP_MISS

         ```bash
         $ curl -I "https://S*******.z01.azurefd.net/media/EteSQSGXMAYVUN_?format=jpg&name=large"
         HTTP/2 200
         cache-control: max-age=604800, must-revalidate
         content-length: 248381
         content-type: image/jpeg
         last-modified: Fri, 05 Feb 2021 15:34:05 GMT
         accept-ranges: bytes
         age: 0
         server: ECS (sjc/4E76)
         x-xcachep2c-originurl: https://p****.com:443/media/EteSQSGXMAYVUN_?    format=jpg&name=large
         x-xcachep2c-originip: 72.21.91.70
         access-control-allow-origin: *
         access-control-expose-headers: Content-Length
         strict-transport-security: max-age=631138519
         surrogate-key: media media/bucket/9 media/1357714621109579782
         x-cache: TCP_MISS
         x-connection-hash: 8c9ea346f78166a032b347a42d8cc561
         x-content-type-options: nosniff
         x-response-time: 26
         x-tw-cdn: VZ
         x-azure-ref-originshield: 0MlAkYAAAAACtEkUH8vEbTIFoZe4xuRLOU0pDRURHRTA1MDgAZDM0ZjBhNGUtMjc4
         x-azure-ref:     0MlAkYAAAAACayEVNiWaKRI61MXUgRe97REFMRURHRTEwMTQAZDM0ZjBhNGUtMjc4 
         date: Wed, 10 Feb 2021 21:29:22 GMT
         ```

      - TCP_HIT

         ```bash
         $ curl -I "https://S*******.z01.azurefd.net/media/EteSQSGXMAYVUN_?format=jpg&name=large"
         HTTP/2 200
         cache-control: max-age=604800, must-revalidate
         content-length: 248381
         content-type: image/jpeg
         last-modified: Fri, 05 Feb 2021 15:34:05 GMT
         accept-ranges: bytes
         age: 0
         server: ECS (sjc/4E76)
         x-xcachep2c-originurl: https://p****.com:443/media/EteSQSGXMAYVUN_?format=jpg&name=large
         x-xcachep2c-originip: 72.21.91.70
         access-control-allow-origin: *
         access-control-expose-headers: Content-Length
         strict-transport-security: max-age=631138519
         surrogate-key: media media/bucket/9 media/1357714621109579782
         x-cache: TCP_HIT
         x-connection-hash: 8c9ea346f78166a032b347a42d8cc561
         x-content-type-options: nosniff
         x-response-time: 26
         x-tw-cdn: VZ
         x-azure-ref-originshield: 0MlAkYAAAAACtEkUH8vEbTIFoZe4xuRLOU0pDRURHRTA1MDgAZDM0ZjBhNGUtMjc4Mi00OWVhLWIzNTYtN2MzYj
         x-azure-ref: 0NVAkYAAAAABHk4Fx0cOtQrp6cHFRf0ocREFMRURHRTEwMDUAZDM0ZjBhNGUtMjc4Mi00OWVhLWIzNTYtN2MzYj
         date: Wed, 10 Feb 2021 21:29:25 GMT
         ```

1. Continue to request against the endpoint until the *x-cache* header has a *TCP_HIT* value
1. ***If the performance issue is resolved***, then the issue was based on the origin's speed, and isn't the Azure Front Door's performance.  The Azure Front Door's cache settings or the origin need to be address by its owner to resolve the performance issue.
1. ***If the issue persists***, then the issue may be with the client requesting the content or the Azure Front Door  
  A. Move to Scenario 2 to identify

## Scenario 2: A Single Client or Location (example: ISP) is Slow

A single client or location being slow can happen if there's a bad network route between the requesting client and the Azure Front Door POP.  Any bad route should be ruled out as it affects the distance to the POP, removing the Azure Front Door POP's proximity benefit.

High latency, or low bandwidth, could be because of an ISP issue, the customer is using a VPN or they're a part of a dispersed corporate network.  A corporate network can run all traffic through a central, remote point.

### Scenario 2 | Environment Information Needed

- Azure Front Door / Endpoint Name
  - Endpoint Hostname
  - Endpoint Custom Domain (if applicable)
  - Origin Hostname
- Full URL of Affected File
- Requesting Client Information
  - Requesting Client IP
  - Requesting Client Location
  - Requesting Client Path to Azure Environment (Usually identified with [TraceRoute](/windows-server/administration/windows-commands/tracert), [PathPing](/windows-server/administration/windows-commands/pathping) or a similar tool).

### Scenario 2 | Troubleshooting Steps

1. To check the path to the POP, use [PathPing](/windows-server/administration/windows-commands/pathping) or similar tool for 500 packets to check the network route.  *PathPing maxes at 250 queries.  To test to 500, run the below query twice*

    ```Console
       pathping /q 250 <Full URL of affected file>
    ```

1. Determine if the traffic is taking a path that would add time or travel to a distant region
   - Look for IP, city or region codes that don't take a reasonable route based on the customer’s geography (example: a customer in Europe getting routed to the United States), or excessive number of hops
1. To rule out requesting client settings, test from a different requesting client in the same region
1. **If additional hops or remote regions are identified**, the issue is with the client accessing the Azure Front Door POP and not with the Azure Front Door itself.  Hops between endpoints needs to be addressed by the connectivity or VPN provider.
1. **If additional hops or remote regions are not identified AND the content is being served from cache (x-cache: TCP_HIT)**, the issue is with the Azure Front Door and a Support Request may need to be created.  Include a reference to this troubleshooting article and steps taken.
   - ***Note***: If the content is being served from the origin (x-cache: TCP_MISS), see [Scenario 1](troubleshoot-performance-issues.md#scenario-1-investigate-the-origin) above

## Scenario 3: A Website Loads Slowly

There are some scenarios where there is ***not*** an issue with a single file but the performance of the whole, Azure Front Door proxied, webpage.  Site performance is measured by a webpage performance tool.  These tools may identify that the Azure Front Door proxied webpage under performs compared to the same webpage outside of the Azure Front Door system.

A webpage consists of many files.  The way the website benefits from the Azure Front Door is only if each file in the webpage is being served from the Azure Front Door.  Additionally, the Azure Front Door must be configured to maximize the benefit.  For example:

- Origin: origin.contoso.com
- Azure Front Door Custom Domain: contoso.com
- Page customer attempts to load: https://contoso.com
- **Explanation**: When the page loads, the initial file at the "/" directory calls other files, which build the page.  These files are images, JavaScript, text files and more.  If those files aren't called via the Azure Front Door hostname, *contoso.com*, the Azure Front Door is ***not*** being utilized.  So, if one of the file requested by the website is *`http://www.images.fabrikam.com/businessimage.jpg`* the file is ***not*** benefiting from the use of the Azure Front Door.  Instead, the file is being requested directly, from the *`images.fabrikam.com`* server, by the browser on the requesting client.

   :::image type="content" source="media/troubleshoot-performance-issues/azure-front-door-performance.jpg" alt-text="Diagram of multiple, differently sourced files for a singular website and how it affects Azure Front Door performance.":::

### Scenario 3 | Environment Information Needed

- Azure Front Door / Endpoint Name
  - Endpoint Hostname
  - Endpoint Custom Domain (if applicable)
  - Origin Hostname
    - Geographic location of the origin
- Full URL of Affected Webpage
- Tool and metric, which is measuring performance

### Scenario 3 | Troubleshooting

1. Review the metric, which is showing the slower performance  
   > [!IMPORTANT]
   > If it is based on a third part tool, Microsoft cannot discern what is being measure by tools not owned by Microsoft
1. Pull up the Azure Front Door webpage in a Browser with Developer Tools (F12) enabled
   > [!NOTE]
   > Your browser's developer tools (F12) in your browser can be used to determine the source of the files being served. To view the *Request URL*, open developer tools (F12), select the *Networking* tab, then the relevant file to be investigated, then the *General*. ***If the file is missing*** the page need to be reloaded with developer tools (F12) open.
1. Note the source, or *Requesting URL*, of files
1. Identify which files are utilizing the Azure Front Door hostname and which aren't
  A. Example: From the above example, an Azure Front Door hosted image would be, `https://www.contoso.com/productimage1.jpg`, and that which wouldn't be, `http://www.images.fabrikam.com/businessimage.jpg`
1. Once gathered test performance for file being served from Azure Front Door, its origin and, if applicable, the testing webpage
   > [!IMPORTANT]
   > If the origin or testing webpage is served from a geographical region closer to the tool testing performance, a tool or requesting client may need to be used in another region to examine the Azure Front Door POP's proximity benefit  
 
   > [!IMPORTANT]
   > Any files served from outside the Azure Front Door's hostname will not be able to benefit from it and the webpage may need to be redesigned to do so
 
   > [!CAUTION]
   > If files are meant to be cached, be sure to test files that have the response header *x-cache: TCP_HIT*
  
1. **If the collected data shows that files are being issued from servers outside the Azure Front Door's hostname**, the Azure Front Door is working as expected  
  A. Slowly loading websites may require a change in webpage design, for assistance in optimizing your website to use an Azure Front Door, connect with your website design team or our [Microsoft Solution Providers](https://www.microsoft.com/solution-providers/home)
   > [!NOTE]
   > Slowly loading websites issue could take time to review based on the complexity of a website's design and it's file calling instructions
1. **If the collected data shows that files' loading performance are better at the Azure Front Door compared to the origin or test site**, the Azure Front Door is working as expected.
    A. The issue may have to do with individual client request issues.  See [Scenario 1](troubleshoot-performance-issues.md#scenario-1-investigate-the-origin) above.
1. **If the collected data shows that performance is ***not*** better at the Azure Front Door**, a Support Request is likely required for further investigation.  Include a reference to this troubleshooting article and steps taken.