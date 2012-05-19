#How to Temporarily Disable Policies and Hosted Services in Windows Azure Traffic Manager#

[This topic contains preliminary content for the CTP release of [Windows Azure Traffic Manager](http://www.windowsazure.com/en-us/home/features/virtual-network/). To begin using the feature, go to the Virtual Network tab located in the [Windows Azure Management Portal](https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=11&ct=1337239339&rver=6.1.6195.0&wp=MBI_SSL&wreply=https:%2F%2Fwindows.azure.com%2Flanding%3Ftarget%3D%252fdefault.aspx&lc=1033&id=267163).]

The Windows Azure Traffic Manager allows you to control the distribution of user traffic to Windows Azure hosted services. For more information see [Overview of Windows Azure Traffic Manager](). 

You can disable previously created Traffic Manager policies so they will not route traffic. When you disable a Traffic Manager policy, the information of the policy will remain intact and editable in the Traffic Manager interface. You can easily enable the policy again and routing will resume. 

You can also disable individual hosted services that are part of a Traffic Manager policy. This action effectively leaves the hosted service as part of the policy, but the policy acts as if the hosted service is not included in it. This action is very useful for temporarily removing a hosted service that is in maintenance mode or being redeployed and so unstable. Once the hosted service is up and running again, it can be re-enabled. 

**Note**  
Disabling a hosted service has nothing to do with its deployment state in Windows Azure. A healthy service will remain up and able to receive traffic even when disabled in Traffic Manager. Also, disabling a hosted service in one policy does not affect its status in another policy. 

##To disable a policy##

1. Select an enabled policy in the Traffic Manager interface tree. 

2. Click **Disable Policy** on the top toolbar. Note that the button will be greyed out if you highlight a policy that is already disabled.

##To enable a policy##

1. Select a disabled policy in the Traffic Manager interface tree. 

2. Click **Enable Policy** on the top toolbar. Note that the button will be greyed out if you highlight a policy that is already disabled.

##To disable a hosted service##

1. Select an enabled hosted service in a policy in the Traffic Manager interface. You will have to expand a policy in order to see the hosted services contained within it. 

2. Click **Disable Service Policy** on the top toolbar. Note that the button will be greyed out if you highlight a hosted service that is already disabled.

3. Traffic will stop flowing to the hosted service based on the DNS TTL time set for the Traffic Manager domain that is part of the policy. See [Monitoring hosted services in the Windows Azure Traffic Manager]() for more information on DNS time to Live (TTL) settings.

##To enable a hosted service##

1. Select a disabled hosted service in a policy in the Traffic Manager interface. You will have to expand a policy in order to see the hosted services contained within it. 

2. Click **Enable Service Policy** on the top toolbar. Note that the button will be greyed out if you highlight a hosted service that is already enabled.

3. Traffic will start flowing to the hosted service again as dictated by the policy. 

