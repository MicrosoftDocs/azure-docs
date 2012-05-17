#How to Edit a Windows Azure Traffic Manager Policy#

[This topic contains preliminary content for the CTP release of [Windows Azure Traffic Manager](http://www.windowsazure.com/en-us/home/features/virtual-network/). To begin using the feature, go to the Virtual Network tab located in the [Windows Azure Management Portal](https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=11&ct=1337246093&rver=6.1.6195.0&wp=MBI_SSL&wreply=https:%2F%2Fwindows.azure.com%2Flanding%3Ftarget%3D%252fdefault.aspx&lc=1033&id=267163).]

The Windows Azure Traffic Manager allows you to control the distribution of user traffic to Windows Azure hosted services. For more information, see [Overview of Windows Azure Traffic Manager](). 

If you just need to temporarily turn off a policy or particular hosted services in the policy, you can temporarily disable them without changing the policy. For more information, see [How to Temporarily Disable Policies and Hosted Services in Windows Azure Traffic Manager](). 

To change a policy to a different type, use the following steps:

1. **Log into the Traffic Manager area in the Management Portal.** The Windows Azure Management portal is at [http://windows.azure.com](http://windows.azure.com). Traffic Manager can be accessed by clicking on **Virtual Network** in the lower left of the portal pages and then choosing **Traffic Manager** from the options in the left pane.

2. **Select the policy** you want to change in the Traffic Manager screen in the Windows Azure Management portal.

3. **Click “Configure”** on the top menu bar.

4. **Make the desired changes to the policy.** Note that if you change the load balancing method, depending on the selected option, the order of the hosted services in the **Selected hosted services** list may or may not be important. For more information about load balance settings, see [How to Load Balance Traffic Equally Across a Set of Hosted Services by Using Windows Azure Traffic Manager](). 

5. Click **Save**.