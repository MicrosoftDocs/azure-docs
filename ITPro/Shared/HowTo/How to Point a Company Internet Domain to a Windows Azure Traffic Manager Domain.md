#How to Point a Company Internet Domain to a Windows Azure Traffic Manager Domain#

[This topic contains preliminary content for the CTP release of [Windows Azure Traffic Manager](http://www.windowsazure.com/en-us/home/features/virtual-network/). To begin using the feature, go to the Virtual Network tab located in the [Windows Azure Management Portal](https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=11&ct=1337246859&rver=6.1.6195.0&wp=MBI_SSL&wreply=https:%2F%2Fwindows.azure.com%2Flanding%3Ftarget%3D%252fdefault.aspx&lc=1033&id=267163).]

The Windows Azure Traffic Manager allows you to control the distribution of user traffic to Windows Azure hosted services. 

Traffic Manager works by applying an intelligent policy engine to the DNS queries on your main company domain name. Update your company owned DNS resource records to point to Traffic Manager domains. Traffic Manager policies attached to those domains then resolve DNS queries on your main company domain name to the IP addresses of specific Windows Azure hosted services contained in the Traffic Manager policies. For more information, see [Overview of Windows Azure Traffic Manager]().

To point your company domain name to a Traffic Manager domain, edit the DNS resource record on your DNS server using a CNAME. 

For example, to point the main company domain **www.contoso.com** to a Traffic Manager domain named **contoso.trafficmanager.net**, update the DNS resource record to be as shown below:
``www.contoso.com IN CNAME contoso.trafficmanager.net``

All traffic going to *www.contoso.com* will now redirect to *contoso.trafficmanager.net*. Be sure that you are using a domain where you want all traffic redirected to Traffic Manager. 

