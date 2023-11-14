---
title: Troubleshoot general performance problems with Azure Front Door
titleSuffix: Azure Front Door
description: In this article, investigate, diagnose, and resolve potential latency or bandwidth problems associated with Azure Front Door and site performance.
services: frontdoor
author: sbdoroff
ms.service: frontdoor
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 08/30/2023
ms.author: stdoroff
#Customer intent: As a <type of user>, I want <some goal> so that <some reason>.
---

# Troubleshoot general performance problems with Azure Front Door

Performance problems can originate in several potential areas: the Azure Front Door service, the origin, the requesting client, or the path between any of these hops. This troubleshooting guide helps you identify which hop along the data path is most likely the root of a problem, and how to resolve the problem.

## Check for known problems

Before you start, check for any known problems on:

- The [Azure Front Door platform](https://azure.status.microsoft/status).
- Internet service providers (ISPs) in the path.
- The requesting client's ability to connect and retrieve data.

## Scenario 1: Investigate the origin

If one of the origin servers is slow, then the first request for an object via Azure Front Door is slow. Further, if the content isn't cached at the Azure Front Door point of presence (POP), requests are forwarded to the origin. Serving from the origin negates the benefit of the POP's proximity and local delivery to the requesting client and instead relies on the origin's performance.

### Scenario 1: Environment information needed

- Azure Front Door endpoint name
  - Endpoint host name
  - Endpoint custom domain (if applicable)
  - Origin host name
- Full URL of the affected file

### Scenario 1: Troubleshooting steps

1. Check the response headers from the affected request.  

   To check response headers, use the following `curl` examples in Bash. You can also use your browser's developer tools by selecting the F12 key. Select the **Networking** tab, select the relevant file to be investigated, and then select the **Headers** tab. If the file is missing, reload the page with the developer tools open.

   The initial response should have an `x-cache` header with a `TCP_MISS` value. The Azure Front Door POP forwards requests with this value to the origin. The origin sends the return traffic on that same path to the requesting client.

   Here's an example that shows `TCP_MISS`:

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

   Here's an example that shows `TCP_HIT`:

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

1. Continue to request against the endpoint until the `x-cache` header has a `TCP_HIT` value.
1. If the performance problem is resolved, the problem was based on the origin's speed and not the performance of Azure Front Door. The owner needs to address the Azure Front Door cache settings or the origin to improve performance.

   If the problem persists, the source might be the client that's requesting the content or the Azure Front Door service. Move to Scenario 2 to identify the source.

## Scenario 2: A single client or location (for example, an ISP) is slow

A single client or location can be slow if there's a bad network route between the requesting client and the Azure Front Door POP. You should rule out any bad route because it affects the distance to the POP, which removes the Azure Front Door POP's proximity benefit.

High latency or low bandwidth could be the result of an ISP problem, if you're using a virtual private network (VPN) or are part of a dispersed corporate network. A corporate network can run all traffic through a central, remote point.

### Scenario 2: Environment information needed

- Azure Front Door endpoint name
  - Endpoint host name
  - Endpoint custom domain (if applicable)
  - Origin host name
- Full URL of the affected file
- Requesting client information
  - Requesting client IP
  - Requesting client location
  - Requesting client path to the Azure environment (usually identified with [tracert](/windows-server/administration/windows-commands/tracert), [pathping](/windows-server/administration/windows-commands/pathping), or a similar tool)

### Scenario 2: Troubleshooting steps

1. To check the path to the POP, use [pathping](/windows-server/administration/windows-commands/pathping) or a similar tool for 500 packets to check the network route.

   Pathping has a maximum of 250 queries. To test to 500, run the following query twice:

   ```Console
   pathping /q 250 <Full URL of Affected File>
   ```

1. Determine if the traffic is taking a path that would add time or travel to a distant region.

   Look for IP, city, or region codes that don't take a reasonable route based on your geography (for example, traffic in Europe is being routed to the United States) or that have an excessive number of hops.
1. To rule out requesting client settings, test from a different requesting client in the same region.
1. If you identify additional hops or remote regions, the problem is with the client accessing the Azure Front Door POP and not with the Azure Front Door service itself. The connectivity or VPN provider needs to address hops between endpoints.

   If you don't identify additional hops or remote regions *and* the content is being served from the cache (`x-cache: TCP_HIT`), the problem is with the Azure Front Door service. You might need to create a support request. Include a reference to this troubleshooting article and the steps that you took.

> [!NOTE]
> When the content is being served from the origin (`x-cache: TCP_MISS`), see [Scenario 1](troubleshoot-performance-issues.md#scenario-1-investigate-the-origin) earlier in this article.

## Scenario 3: A website loads slowly

In some scenarios, there's no problem with a single file but the performance of a whole (Azure Front Door proxied) webpage is unsatisfactory. A webpage performance tool shows poor site performance compared to a webpage outside Azure Front Door.

A webpage often consists of many files. A website benefits from Azure Front Door only if Azure Front Door is serving each file on a webpage. You must configure Azure Front Door to maximize the benefit.

Consider the following example:

- Origin: `origin.contoso.com`
- Azure Front Door custom domain: `contoso.com`
- Page that you're trying to load: `https://contoso.com`

When the page loads, the initial file at the "/" directory calls other files, which build the page. These files are images, JavaScript, text files, and more. If those files aren't called via the Azure Front Door host name (`contoso.com`), the page is not using Azure Front Door. So, if one of the files that the website requests is `http://www.images.fabrikam.com/businessimage.jpg`, the file is not benefiting from the use of Azure Front Door. Instead, the browser on the requesting client is requesting the file directly from the `images.fabrikam.com` server.

:::image type="content" source="media/troubleshoot-performance-issues/azure-front-door-performance.jpg" alt-text="Diagram of multiple, differently sourced files for a singular website and how that configuration affects Azure Front Door performance.":::

### Scenario 3: Environment information needed

- Azure Front Door endpoint name
  - Endpoint host name
  - Endpoint custom domain (if applicable)
  - Origin host name
  - Geographical location of the origin
- Full URL of the affected webpage
- Tool and metric that are measuring performance

### Scenario 3: Troubleshooting

1. Review the metric that shows the slower performance.

   > [!IMPORTANT]
   > Microsoft can't discern what's being measured by tools that it doesn't own.
1. Open the Azure Front Door webpage in a browser, and then open the developer tools by selecting the F12 key.

   You can use the developer tools in your browser to determine the source of the files being served. To view the *request URL* in the developer tools, select the **Networking** tab, select the file that you're investigating, and then select **General**. If the file is missing, reload the page with the developer tools open.
1. Note the source, or the request URL, of the files.
1. Identify which files are using the Azure Front Door host name and which files aren't.
  
   In the preceding example, an image hosted in Azure Front Door would be `https://www.contoso.com/productimage1.jpg`. An image not hosted in Azure Front Door would be `http://www.images.fabrikam.com/businessimage.jpg`.
1. Test the performance of the file that Azure Front Door is serving, its origin, and (if applicable) the testing webpage.

   If the origin or testing webpage is served from a geographical region closer to the tool that's testing performance, you might need to use a tool or requesting client in another region to examine the Azure Front Door POP's proximity benefit.
  
   > [!IMPORTANT]
   > Any files served from outside the Azure Front Door host name won't benefit from it. You might need to redesign the webpage to do so.

   If files are meant to be cached, be sure to test files that have the response header `x-cache: TCP_HIT`.
  
1. Take action based on the collected data:

   - If the collected data shows that files are being issued from servers outside the Azure Front Door host name, Azure Front Door is working as expected.

     Slowly loading websites might require a change in webpage design. For assistance in optimizing your website to use Azure Front Door, connect with your website design team or with [Microsoft solution providers](https://www.microsoft.com/solution-providers/home).

     > [!NOTE]
     > The problem of slowly loading websites could take time to review, based on the complexity of a website's design and its file-calling instructions.

   - If the collected data shows that the files' loading performance is better at Azure Front Door compared to the origin or test site, Azure Front Door is working as expected. The source of the problem might be individual client requests. In that case, see [Scenario 1](troubleshoot-performance-issues.md#scenario-1-investigate-the-origin) earlier in this article.

   - If the collected data shows that performance is *not* better at Azure Front Door, you likely need to file a support request for further investigation. Include a reference to this troubleshooting article and the steps that you took.
