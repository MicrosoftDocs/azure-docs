Microsoft Azure Traffic Manager allows you to load balance your web site traffic using several load balancing methods. For more information on Traffic Manager, see the [Traffic Manager product page](http://www.windowsazure.com/en-us/documentation/services/traffic-manager/). To use your web site with Traffic Manager, perform the following steps.

1. If you do not already have a Traffic Manager profile, use the information in [Create a Traffic Manager profile using Quick Create][createprofile] to create one. Note the **.trafficmgr.com** domain name associated with your Traffic Manager profile. This will be used in a later step.

2. Use the information in [Add or Delete Endpoints][addendpoint] to add your web site as an endpoint in your Traffic Manager profile.

	> [WACOM.NOTE] If your web site is not listed when adding an endpoint, verify that it is configured for Standard mode. You must use Standard mode for your web site in order to work with Traffic Manager.
