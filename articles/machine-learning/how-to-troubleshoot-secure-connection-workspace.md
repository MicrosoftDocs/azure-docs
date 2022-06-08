
## DNS

1. On the Private Endpoint, click the link to the right of "Network Interface"
1. Navigate to "IP Configurations" section
1. Click the first link in the "Subnet" column
1. You should be taken to the VNet the Private Endpoint is in, make note of the VNet
1. If "DNS Servers" is set to "Default (Azure-Provided)" or "168.63.129.16", then the VNet is using Azure DNS. If there are IP addresses list, then the VNet us using a custom DNS solution. Make note of the VNet, and whether the VNet is using default or custom DNS.

### Is Private DNS integration correct?

1. On the Private Endpoint, click "Private DNS Zone Groups"
1. If "Private DNS Zone Groups" is empty, then the customer almost certainly setup their Private Endpoint incorrectly
1. Have the customer delete the Private Endpoint, and recreate it ensuring they enabled Private DNS zone integrationPrivate DNS Integration Enabled.png
1. Scroll down to "Private DNS Zone Configurations"
1. Note the Private DNS Zone IDs for both lis ted zones
1. Search for "privatelink.api" in the "Search for resources" text box
1. Iterate through the results until you find the "privatelink.api" zone from step 4
1. Scroll down to "Virtual Network Links"
1. If the VNet is using Azure DNS, ensure this Private DNS zone has a link to the VNet. If it does not then the customer chose the incorrect Private DNS zone when creating the Private Endpoint. Have the customer delete the Private Endpoint and chose a Private DNS Zone linked to the VNet, or have the customer create a new Private DNS Zone that is linked to the VNet
1. Repeat steps 5-8, but for "privatelink.notebooks"

### Disable DNS over HTTPS

If there does not appear to be any DNS configuration issue above, DNS over HTTPS may be the issue. This will prevent Azure DNS from responding with the IP address of the Private Endpoint.

* [Disable in Firefox](https://support.mozilla.org/en-US/kb/firefox-dns-over-https)
* Chromium Edge
    * Search for DNS in Edge settings: image.png
    * Ensure "Use secure DNS to specify how to lookup the network address for websites" is disabled

### Troubleshoot custom DNS

1. From a virtual machine, laptop, desktop, or other compute resource that has a working connection to the private endpoint, open a web browser and visit the URL in the following table that matches your Azure region:

    | Azure region | URL |
    | ----- | ----- |
    | Azure Government | https://portal.azure.us/?feature.privateendpointmanagedns=false |
    | Azure China 21Vianet | https://portal.azure.cn/?feature.privateendpointmanagedns=false |
    | All other regions | https://ms.portal.azure.com/?feature.privateendpointmanagedns=false |

1. In the portal, select the private endpoint for the workspace. Make a list of FQDNs listed for the private endpoint.
1. Open a command prompt, PowerShell, or other command line and run the following command for each FQDN returned from the previous step. Each time you run the command, verify that the IP address returned matches the IP address listed in the portal for the FQDN: 

    `nslookup <fqdn>`

    For example.....

1. If the `nslookup` command returns an error, or returns a different IP address than displayed in the portal, then the custom DNS solution isn't configured correctly. For information on using a custom DNS, see blah blah blah.

