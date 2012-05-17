#How to Test a Windows Azure Traffic Manager Policy#

[This topic contains preliminary content for the CTP release of [Windows Azure Traffic Manager](http://www.windowsazure.com/en-us/home/features/virtual-network/). To begin using the feature, go to the Virtual Network tab located in the [Windows Azure Management Portal](https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=11&ct=1337239005&rver=6.1.6195.0&wp=MBI_SSL&wreply=https:%2F%2Fwindows.azure.com%2Flanding%3Ftarget%3D%252fdefault.aspx&lc=1033&id=267163).]

The Windows Azure Traffic Manager allows you to control the distribution of user traffic to Windows Azure hosted services. For more information, see [Overview of Windows Azure Traffic Manager](). The best way to test your policy is to set up a number of clients and then bring the services in your policy down one at a time. 

The best way to test your policy is to set up a number of clients and then bring the services in your policy down one at a time. The following tips will help you test your Traffic Manager policy:

- **Set the DNS TTL very low** so that changes will propagate quickly - 30 seconds, for example.

- **Know the IP addresses of the Windows Azure hosted services** in the policy you are testing. You can obtain this information from the Windows Azure Management Portal. Click on the Production Deployment of your service. In the properties pane on the right, the last entry will be the VIP, which is the virtual IP address of that hosted service.

![Hosted service IP location](Media\hosted_service_IP_location)

**Figure 1** -  hosted service IP location

- **Use tools that let you resolve a DNS name to an IP address** and display that address. You are checking to see that your company domain name resolves to IP addresses of the hosted services in your policy. They should resolve in a manner consistent with the load balancing method of your Traffic Manager policy. If you are on a Windows system, you can use nslookup from a CMD window. Other publicly available tools that allow you to "dig" an IP address are also readily available on the Internet.

- **Check the Traffic Manager policy** by using *nslookup*. 

>### **To check an Traffic Manager policy with nslookup**  ###

>1. Start a CMD window by clicking Start-Run and typing CMD.

>2. In order to flush the DNS resolver cache, type ``ipconfig /flushdns``.

>3. Type the command ``nslookup <your traffic manager domain>``.
 For example, the following command command checks the domain with the prefix *myapp.contoso* ``nslookup myapp.contoso.trafficmanager.net``

>>A typical result will show the following:

>> - The DNS name and IP address of the DNS server being accessed to resolve this Traffic Manager domain.

>> - The Traffic Manager domain name you typed on the command line after "nslookup" and the IP address that Traffic Manager domain resolves to. 
The second IP address is the important one to check. It should match a VIP for one of the hosted services in the Traffic Manager policy you are testing.

>>![nslookup command example](Media\nslookup_command_example)

>>**Figure 2** – nslookup command example

- **Use one of the additional testing methods listed below.** Select the appropriate method for the type of load balancing you are testing.

##Performance policies##

You will need clients in different parts of the world to effectively test your domain. You could create clients in Windows Azure which will attempt to call your services via your company domain name. Alternatively, if your corporation is global you can remotely log into clients in other parts of the country and test from those clients.

There are free web based nslookup and dig services available. Some of these give you the ability to check DNS name resolution from various locations. Do a search on nslookup for examples. Another option is to use a 3rd party solution like Gomez or Keynote to confirm that your policies are distributing traffic as expected.

##Failover policies##

1. Leave all services up.

2. Use a single client.

3. Request DNS resolution for your company domain using ping or a similar utility.

4. Ensure that the IP address your obtain is for your primary hosted service. 

5. Bring your primary service down or remove the monitoring file so that Traffic Manager thinks it is down.

6. Wait at least 2 minutes. 

7. Request DNS resolution.

8. Ensure that the IP address you obtain is for your secondary hosted service as shown by the order of the services in the Edit Traffic Manager Policy dialog box.

9. Repeat the process, bringing down the secondary service and then the tertiary and so on. Each time, be sure that the DNS resolution returns the IP address of the next service in the list. When all services are down, you should obtain the IP address of the primary hosted service again.

##Round Robin policies##

1. Leave all services up.

2. Use a single client.

3. Request DNS resolution for your top level domain.

4. Ensure that the IP address you obtain is one of those in your list.

5. Repeat the process letting the DNS TTL expire so that you will receive a new IP address. You should see IP addresses returned for each of your hosted services. Then the process will repeat. 

[0]: ..\Media\hosted_service_IP_location.png

[1]: ..\Media\nslookup_command_example.png
