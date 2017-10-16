## Integrating your ILB ASE with an Application Gateway ##

The [Azure App Service Environment(ASE)](./intro.md) is a deployment of the Azure App Service in the subnet of a customer's Azure Virtual Network. It can be deployed with a public or private endpoint for app access. The Azure Application Gateway is a virtual appliance that provides layer 7 load balancing, SSL offloading and WAF protection. It can listen on a public IP address and route traffic to your application endpoint. The following information describes how to integrate a WAF configured Application Gateway with an app on an ILB ASE.  

The integration of the Application Gateway with the ILB ASE is at an app level.  That is to say that when you configure the two together you are doing it for specific apps in your ILB ASE and not for all of the apps in your ILB ASE. This is important because it means that you can expose just what you want in your ILB ASE while keeping the rest secure. Among other use cases, this enables hosting secure multi-tenant applications in a single ILB ASE. A multi-tier application on an ILB ASE with an Application Gateway will logically look like this diagram. 

![Application Gateway pointing to app on an ILB ASE][1]

To integrate your Application Gateway with your ILB ASE you need :

* an ILB ASE
* an app running in the ILB ASE
* an internet routable domain name to be used with your app in thee ILB ASE.  This has to be set as a custom domain name for your app.  
* the ILB address used by your ILB ASE (This is in the ASE portal under Settings -> IP Addresses)

	![IP addresses used by your ILB ASE][9]
	
* a public DNS name that will be later pointed to your application gateway 

For details on how to create an ILB ASE please read the document [Creating and using an ILB ASE](./ilbase.md)

This guide assumes you want an Application Gateway in the same Azure Virtual Network that the ASE is deployed into. Before starting the Application Gateway creation, note the subnet that you will use to host the Application Gateway. Pick a subnet that is not the GatewaySubnet or the subnet used by the ILB ASE.
If you put the Application Gateway in the GatewaySubnet then you will be unable to create a Virtual Network gateway later. You also cannot put it into the subnet used by your ILB ASE. 

1. From within the Azure portal go to **New > Network > Application Gateway** 
	a. Provide:
		a. Name of the Application Gateway
		b. Select WAF
		c. Select the same subscription used for the ASE VNet
		d. Create or select the resource group
		e. Select the Location the ASE VNet is in

	![New application gateway creation basics][2]
	
	b. In the Settings area set
		a. The ASE VNet
		b. The subnet the Application Gateway needs to be deployed into 
		c. Select Public
		d. Select a public IP address.  If you do not have one then create one at this time
		e. Configure for HTTP or HTTPS.  If configuring for HTTPS you need to provide a PFX certificate
		f. Select Upgrade to WAF tier
		It can take a little more than 30 minutes for your Application Gateway to complete setup.  
	
	![New application gateway creation settings][3]

2. After your Application Gateway comples setup go into your Application Gateway portal. Select **Backend pool**.  Add the ILB address for your ILB ASE.

	![Configure backend pool][4]

3. After the processing completes for configuring your backend pool select **Health probes**. create a health probe for domain name you want to use for your app. 

	![Configure health probes][5]
	
4. After processing completes for configuring your health probes select **HTTP settings**.  Edit the existing setting there, select **Use Custom probe**, and pick the probe you configured 

	![Configure HTTP settings][6]
	
5. Go to the Application Gateway **Overview** and copy the public IP address used for your Application Gateway.  Set that IP address as an A record for your app domain name or use the DNS name for that address in a CNAME record.  It is easier to select the public IP address and copy it from the Public IP address UI rather than copy it from the link on the Application Gateway Overview section. 

	![Application Gateway portal][7]

6. Set the custom domain name for your app in your ILB ASE.  Go to your app in the portal and under Settings select **Custom domains**

![Set custom domain name on the app][8]

There is information on setting custom domain names for your web apps here [customdomain]. The big difference though with an app in an ILB ASE is that there isn't any validation on the domain name.  Since you own the DNS that manages the app endpoints you can put whatever you want in there so there isn't validation that you own the DNS name in the public DNS.  but then you need to set that DNS name up with your app.  


<!-- LINKS -->
[appgw] http://docs.microsoft.com/azure/application-gateway/application-gateway-introduction
[customdomain] ../app-service-web-tutorial-custom-domain.md

<!-- IMAGES -->
[1]: ./media/integrate-with-application-gateway/appgw-highlevel.png
[2]: ./media/integrate-with-application-gateway/appgw-createbasics.png
[3]: ./media/integrate-with-application-gateway/appgw-createsettings.png
[4]: ./media/integrate-with-application-gateway/appgw-backendpool.png
[5]: ./media/integrate-with-application-gateway/appgw-healthprobe.png
[6]: ./media/integrate-with-application-gateway/appgw-httpsettings.png
[7]: ./media/integrate-with-application-gateway/appgw-publicip.png
[8]: ./media/integrate-with-application-gateway/appgw-customdomainname.png
[9]: ./media/integrate-with-application-gateway/appgw-iplist.png
