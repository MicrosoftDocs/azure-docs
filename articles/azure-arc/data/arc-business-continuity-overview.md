# Overview of business continuity with Azure Arc enabled SQL Managed Instance (Preview)

Business continuity is a combination of people, processes and technology that enables businesses to recover and continue operating in the event of disruptions. In hybrid scenarios there is a joint responsibility between Microsoft and customer, such that  customer owns and manages the infrastructure while the software is provided by Microsoft. 

This overview describes the set of capabilithes that come built-in with Azure Arc enabled SQL Managed Instances and how they can be levaraged to recover from disruptions. 

| Feature         | Use case     | Service Tier      | 
|--------------|-----------|---------------|
| Point in time restore | Use the built-in Point in time restore (PITR) feature to recover from situations such as data corruptions caused by human errors. Learn more about [Point in time restore](.\point-in-time-restore.md) | Available in both General Purpose and Business Critical service tiers|
| High Availability | Deploy the Aure Arc enabled SQL Managed Instnce in a high availability mode to achieve local high availability to recover from scenarios such as hardware failures, pod/node failures etc. The build-in listener service automatically redirects new connections to another replica while kubernetes attempts to rebuild the failed replica. Learn more about [high-availability in Azure Arc enabled SQL Managed Instance](.\high-availability.md) |This feature is only available in **Business Critical** service tier. <br> For General Purpose service tier, kubernates provides basic recoverability from scenarios such as node/pod crashes. |
|Disaster Recovery| Configure Disaster Recovery by setting up another instance of Azure Arc enabled SQL Managed instance in a geo-secondary data center to synchronize data from the geo-primary data center. This scenario is useful for recovering from events when an entire data center is down due to disruptions such as power outages or other events. |  Available in both General Purpose and Business Critical service tiers| 
|



## Next steps

[Learn more about configuring Point in time restore](.\point-in-time-restore.md)

[Learn more about configuring high availability in Azure Arc enabled SQL Managed Instance](.\high-availability-arcsqlmi.md)

[Learn more about setting up and configuring Disaster Recovery in Azure Arc enabled SQL Managed Instance](.\disaster-recovery-arcsqlmi.md)







