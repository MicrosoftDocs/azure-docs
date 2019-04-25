---
title: "Video indexed, Azure SaaS SQL app | Microsoft Docs"
description: "This article indexes various time points in our 81 minutes video about SaaS DB tenancy app design, from the Ignite conference held October 11, 2017. You can skip ahead to the part that interests you. At least 3 patterns are described. Azure features that simplify development and management are described."
services: sql-database
ms.service: sql-database
ms.subservice: scenario
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: MightyPen
ms.author: genemi
ms.reviewer: billgib, sstein
manager: craigg
ms.date: 12/18/2018
ms.topic: conceptual
---
# Video indexed and annotated for multi-tenant SaaS app using Azure SQL Database

This article is an annotated index into the time locations of an 81 minute video about SaaS tenancy models or patterns. This article enables you to skip backward or forward in the video to which portion interests you. The video explains the major design options for a multi-tenant database application on Azure SQL Database. The video includes demos, walkthroughs of management code, and at times more detail informed by experience than might be in our written documentation.

The video amplifies information in our written documentation, found at: 
- *Conceptual:* [Multi-tenant SaaS database tenancy patterns][saas-concept-design-patterns-563e]
- *Tutorials:* [The Wingtip Tickets SaaS application][saas-how-welcome-wingtip-app-679t]

The video and the articles describe the many phases of creating a multi-tenant application on Azure SQL Database in the cloud. Special features of Azure SQL Database make it easier to develop and implement multi-tenant apps that are both easier to manage and reliably performant.

We routinely update our written documentation. The video is not edited or updated, so eventually more of its detail may become outdated.



## Sequence of 38 time-indexed screenshots

This section indexes the time location for 38 discussions throughout the 81 minute video. Each time index is annotated with a screenshot from the video, and sometimes with additional information.

Each time index is in the format of *h:mm:ss*. For instance, the second indexed time location, labeled **Session objectives**, starts at the approximate time location of **0:03:11**.


### Compact links to video indexed time locations

The following titles are links to their corresponding annotated sections later in this article:

- [1. **(Start)** Welcome slide, 0:00:03](#anchor-image-wtip-min00001)
- [2. Session objectives, 0:03:11](#anchor-image-wtip-min00311)
- [3. Agenda, 0:04:17](#anchor-image-wtip-min00417)
- [4. Multi-tenant web app, 0:05:05](#anchor-image-wtip-min00505)
- [5. App web form in action, 0:05:55](#anchor-image-wtip-min00555)
- [6. Per-tenant cost (scale, isolation, recovery), 0:09:31](#anchor-image-wtip-min00931)
- [7. Database models for multi-tenant: pros and cons, 0:11:59](#anchor-image-wtip-min01159)
- [8. Hybrid model blends benefits of MT/ST, 0:13:01](#anchor-image-wtip-min01301)
- [9. Single-tenant vs multi-tenant: pros and cons, 0:16:44](#anchor-image-wtip-min01644)
- [10. Pools are cost-effective for unpredictable workloads, 0:19:36](#anchor-image-wtip-min01936)
- [11. Demo of database-per-tenant and hybrid ST/MT, 0:20:08](#anchor-image-wtip-min02008)
- [12. Live app form showing Dojo, 0:20:29](#anchor-image-wtip-min02029)
- [13. MYOB and not a DBA in sight, 0:28:54](#anchor-image-wtip-min02854)
- [14. MYOB elastic pool usage example, 0:29:40](#anchor-image-wtip-min02940)
- [15. Learning from MYOB and other ISVs, 0:31:36](#anchor-image-wtip-min03136)
- [16. Patterns compose into E2E SaaS scenario, 0:43:15](#anchor-image-wtip-min04315)
- [17. Canonical hybrid multi-tenant SaaS app, 0:47:33](#anchor-image-wtip-min04733)
- [18. Wingtip SaaS sample app, 0:48:10](#anchor-image-wtip-min04810)
- [19. Scenarios and patterns explored in the tutorials, 0:49:10](#anchor-image-wtip-min04910)
- [20. Demo of tutorials and GitHub repository, 0:50:18](#anchor-image-wtip-min05018)
- [21. GitHub repo Microsoft/WingtipSaaS, 0:50:38](#anchor-image-wtip-min05038)
- [22. Exploring the patterns, 0:56:20](#anchor-image-wtip-min05620)
- [23. Provisioning tenants and onboarding, 0:57:44](#anchor-image-wtip-min05744)
- [24. Provisioning tenants and application connection, 0:58:58](#anchor-image-wtip-min05858)
- [25. Demo of management scripts provisioning a single tenant, 0:59:43](#anchor-image-wtip-min05943)
- [26. PowerShell to provision and catalog, 1:00:02](#anchor-image-wtip-min10002)
- [27. T-SQL SELECT * FROM TenantsExtended, 1:03:30](#anchor-image-wtip-min10330)
- [28. Managing unpredictable tenant workloads, 1:04:36](#anchor-image-wtip-min10436)
- [29. Elastic pool monitoring, 1:06:39](#anchor-image-wtip-min10639)
- [30. Load generation and performance monitoring, 1:09:42](#anchor-image-wtip-min10942)
- [31. Schema management at scale, 1:10:33](#anchor-image-wtip-min11033)
- [32. Distributed query across tenant databases, 1:12:21](#anchor-image-wtip-min11221)
- [33. Demo of ticket generation, 1:12:32](#anchor-image-wtip-min11232)
- [34. SSMS adhoc analytics, 1:12:46](#anchor-image-wtip-min11246)
- [35. Extract tenant data into SQL DW, 1:16:32](#anchor-image-wtip-min11632)
- [36. Graph of daily sale distribution, 1:16:48](#anchor-image-wtip-min11648)
- [37. Wrap up and call to action, 1:19:52](#anchor-image-wtip-min11952)
- [38. Resources for more information, 1:20:42](#anchor-image-wtip-min12042)


&nbsp;

### Annotated index time locations in the video

Clicking any screenshot image takes you to the exact time location in the video.


&nbsp;
<a name="anchor-image-wtip-min00001"/>
#### 1. *(Start)* Welcome slide, 0:00:01

*Learning from MYOB: Design patterns for SaaS applications on Azure SQL Database - BRK3120*

[![Welcome slide][image-wtip-min00003-brk3120-whole-welcome]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=1)

- Title: Learning from MYOB: Design patterns for SaaS applications on Azure SQL Database
- Bill.Gibson@microsoft.com
- Principal Program Manager, Azure SQL Database
- Microsoft Ignite session BRK3120, Orlando, FL USA, October/11 2017


&nbsp;
<a name="anchor-image-wtip-min00311"/>
#### 2. Session objectives, 0:01:53
[![Session objectives][image-wtip-min00311-session]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=113)

- Alternative models for multi-tenant apps, with pros and cons.
- SaaS patterns to reduce development, management, and resource costs.
- A sample app + scripts.
- PaaS features + SaaS patterns make SQL Database a highly scalable, cost-efficient data platform for multi-tenant SaaS.


&nbsp;
<a name="anchor-image-wtip-min00417"/>
#### 3. Agenda, 0:04:09
[![Agenda][image-wtip-min00417-agenda]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=249)


&nbsp;
<a name="anchor-image-wtip-min00505"/>
#### 4. Multi-tenant web app, 0:05:00
[![Wingtip SaaS app: Multi-tenant web app][image-wtip-min00505-web-app]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=300)


&nbsp;
<a name="anchor-image-wtip-min00555"/>
#### 5. App web form in action, 0:05:39
[![App web form in action][image-wtip-min00555-app-web-form]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=339)


&nbsp;
<a name="anchor-image-wtip-min00931"/>
#### 6. Per-tenant cost (scale, isolation, recovery), 0:06:58
[![Per-tenant cost, scale, isolation, recovery][image-wtip-min00931-per-tenant-cost]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=418)


&nbsp;
<a name="anchor-image-wtip-min01159"/>
#### 7. Database models for multi-tenant: pros and cons, 0:09:52
[![Database models for multi-tenant: pros and cons][image-wtip-min01159-db-models-pros-cons]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=592)


&nbsp;
<a name="anchor-image-wtip-min01301"/>
#### 8. Hybrid model blends benefits of MT/ST, 0:12:29
[![Hybrid model blends benefits of MT/ST][image-wtip-min01301-hybrid]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=749)


&nbsp;
<a name="anchor-image-wtip-min01644"/>
#### 9. Single-tenant vs multi-tenant: pros and cons, 0:13:11
[![Single-tenant vs multi-tenant: pros and cons][image-wtip-min01644-st-vs-mt]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=791)


&nbsp;
<a name="anchor-image-wtip-min01936"/>
#### 10. Pools are cost-effective for unpredictable workloads, 0:17:49
[![Pools are cost-effective for unpredictable workloads][image-wtip-min01936-pools-cost]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=1069)


&nbsp;
<a name="anchor-image-wtip-min02008"/>
#### 11. Demo of database-per-tenant and hybrid ST/MT, 0:19:59
[![Demo of database-per-tenant and hybrid ST/MT][image-wtip-min02008-demo-st-hybrid]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=1199)


&nbsp;
<a name="anchor-image-wtip-min02029"/>
#### 12. Live app form showing Dojo, 0:20:10
[![Live app form showing Dojo][image-wtip-min02029-live-app-form-dojo]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=1210)

&nbsp;
<a name="anchor-image-wtip-min02854"/>
#### 13. MYOB and not a DBA in sight, 0:25:06
[![MYOB and not a DBA in sight][image-wtip-min02854-myob-no-dba]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=1506)


&nbsp;
<a name="anchor-image-wtip-min02940"/>
#### 14. MYOB elastic pool usage example, 0:29:30
[![MYOB elastic pool usage example][image-wtip-min02940-myob-elastic]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=1770)


&nbsp;
<a name="anchor-image-wtip-min03136"/>
#### 15. Learning from MYOB and other ISVs, 0:31:25
[![Learning from MYOB and other ISVs][image-wtip-min03136-learning-isvs]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=1885)


&nbsp;
<a name="anchor-image-wtip-min04315"/>
#### 16. Patterns compose into E2E SaaS scenario, 0:31:42
[![Patterns compose into E2E SaaS scenario][image-wtip-min04315-patterns-compose]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=1902)


&nbsp;
<a name="anchor-image-wtip-min04733"/>
#### 17. Canonical hybrid multi-tenant SaaS app, 0:46:04
[![Canonical hybrid multi-tenant SaaS app][image-wtip-min04733-canonical-hybrid]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=2764)


&nbsp;
<a name="anchor-image-wtip-min04810"/>
#### 18. Wingtip SaaS sample app, 0:48:01
[![Wingtip SaaS sample app][image-wtip-min04810-wingtip-saas-app]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=2881)


&nbsp;
<a name="anchor-image-wtip-min04910"/>
#### 19. Scenarios and patterns explored in the tutorials, 0:49:00
[![Scenarios and patterns explored in the tutorials][image-wtip-min04910-scenarios-tutorials]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=2940)


&nbsp;
<a name="anchor-image-wtip-min05018"/>
#### 20. Demo of tutorials and GitHub repository, 0:50:12
[![Demo tutorials and GitHub repo][image-wtip-min05018-demo-tutorials-github]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=3012)


&nbsp;
<a name="anchor-image-wtip-min05038"/>
#### 21. GitHub repo Microsoft/WingtipSaaS, 0:50:32
[![GitHub repo Microsoft/WingtipSaaS][image-wtip-min05038-github-wingtipsaas]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=3032)


&nbsp;
<a name="anchor-image-wtip-min05620"/>
#### 22. Exploring the patterns, 0:56:15
[![Exploring the patterns][image-wtip-min05620-exploring-patterns]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=3375)


&nbsp;
<a name="anchor-image-wtip-min05744"/>
#### 23. Provisioning tenants and onboarding, 0:56:19
[![Provisioning tenants and onboarding][image-wtip-min05744-provisioning-tenants-onboarding-1]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=3379)


&nbsp;
<a name="anchor-image-wtip-min05858"/>
#### 24. Provisioning tenants and application connection, 0:57:52
[![Provisioning tenants and application connection][image-wtip-min05858-provisioning-tenants-app-connection-2]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=3472)


&nbsp;
<a name="anchor-image-wtip-min05943"/>
#### 25. Demo of management scripts provisioning a single tenant, 0:59:36
[![Demo of management scripts provisioning a single tenant][image-wtip-min05943-demo-management-scripts-st]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=3576)


&nbsp;
<a name="anchor-image-wtip-min10002"/>
#### 26. PowerShell to provision and catalog, 0:59:56
[![PowerShell to provision and catalog][image-wtip-min10002-powershell-provision-catalog]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=3596)


&nbsp;
<a name="anchor-image-wtip-min10330"/>
#### 27. T-SQL SELECT * FROM TenantsExtended, 1:03:25
[![T-SQL SELECT * FROM TenantsExtended][image-wtip-min10330-sql-select-tenantsextended]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=3805)


&nbsp;
<a name="anchor-image-wtip-min10436"/>
#### 28. Managing unpredictable tenant workloads, 1:03:34
[![Managing unpredictable tenant workloads][image-wtip-min10436-managing-unpredictable-workloads]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=3814)


&nbsp;
<a name="anchor-image-wtip-min10639"/>
#### 29. Elastic pool monitoring, 1:06:32
[![Elastic pool monitoring][image-wtip-min10639-elastic-pool-monitoring]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=3992)


&nbsp;
<a name="anchor-image-wtip-min10942"/>
#### 30. Load generation and performance monitoring, 1:09:37
[![Load generation and performance monitoring][image-wtip-min10942-load-generation]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=4117)


&nbsp;
<a name="anchor-image-wtip-min11033"/>
#### 31. Schema management at scale, 1:09:40
[![Schema management at scale][image-wtip-min11033-schema-management-scale]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=34120)


&nbsp;
<a name="anchor-image-wtip-min11221"/>
#### 32. Distributed query across tenant databases, 1:11:18
[![Distributed query across tenant databases][image-wtip-min11221-distributed-query]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=4278)


&nbsp;
<a name="anchor-image-wtip-min11232"/>
#### 33. Demo of ticket generation, 1:12:28
[![Demo of ticket generation][image-wtip-min11232-demo-ticket-generation]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=4348)


&nbsp;
<a name="anchor-image-wtip-min11246"/>
#### 34. SSMS adhoc analytics, 1:12:35
[![SSMS adhoc analytics][image-wtip-min11246-ssms-adhoc-analytics]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=4355)


&nbsp;
<a name="anchor-image-wtip-min11632"/>
#### 35. Extract tenant data into SQL DW, 1:15:46
[![Extract tenant data into SQL DW][image-wtip-min11632-extract-tenant-data-sql-dw]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=4546)


&nbsp;
<a name="anchor-image-wtip-min11648"/>
#### 36. Graph of daily sale distribution, 1:16:38
[![Graph of daily sale distribution][image-wtip-min11648-graph-daily-sale-distribution]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=4598)


&nbsp;
<a name="anchor-image-wtip-min11952"/>
#### 37. Wrap up and call to action, 1:17:43
[![Wrap up and call to action][image-wtip-min11952-wrap-up-call-action]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=4663)


&nbsp;
<a name="anchor-image-wtip-min12042"/>
#### 38. Resources for more information, 1:20:35
[![Resources for more information][image-wtip-min12042-resources-more-info]](https://www.youtube.com/watch?v=jjNmcKBVjrc&t=4835)

- [Blog post, May 22, 2017][resource-blog-saas-patterns-app-dev-sql-db-768h]

- *Conceptual:* [Multi-tenant SaaS database tenancy patterns][saas-concept-design-patterns-563e]

- *Tutorials:* [The Wingtip Tickets SaaS application][saas-how-welcome-wingtip-app-679t]

- GitHub repositories for flavors of the Wingtip Tickets SaaS tenancy application:
    - [GitHub repo for - Standalone application model][github-wingtip-standaloneapp].
    - [GitHub repo for - DB Per Tenant model][github-wingtip-dbpertenant].
    - [GitHub repo for - Multi-Tenant DB model][github-wingtip-multitenantdb].





## Next steps

- [First tutorial article][saas-how-welcome-wingtip-app-679t]




<!-- Image link reference IDs. -->

[image-wtip-min00003-brk3120-whole-welcome]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min00003-brk3120-welcome-myob-design-saas-app-sql-db.png "Welcome slide"

[image-wtip-min00311-session]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min00311-session-objectives-takeaway.png "Session objectives."

[image-wtip-min00417-agenda]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min00417-agenda-app-management-models-patterns.png "Agenda."

[image-wtip-min00505-web-app]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min00505-wingtip-saas-app-mt-web.png "Wingtip SaaS app: Multi-tenant web app"

[image-wtip-min00555-app-web-form]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min00555-app-form-contoso-concert-hall-night-opera.png "App web form in action"

[image-wtip-min00931-per-tenant-cost]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min00931-saas-data-management-concerns.png "Per-tenant cost, scale, isolation, recovery"

[image-wtip-min01159-db-models-pros-cons]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min01159-db-models-multi-tenant-saas-apps.png "Database models for multi-tenant: pros and cons"

[image-wtip-min01301-hybrid]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min01301-hybrib-model-blends-benefits-mt-st.png "Hybrid model blends benefits of MT/ST"

[image-wtip-min01644-st-vs-mt]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min01644-st-mt-pros-cons.png "Single-tenant vs multi-tenant: pros and cons"

[image-wtip-min01936-pools-cost]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min01936-pools-cost-effective-unpredictable-workloads.png "Pools are cost-effective for unpredictable workloads"

[image-wtip-min02008-demo-st-hybrid]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min02008-demo-st-hybrid.png "Demo of database-per-tenant and hybrid ST/MT"

[image-wtip-min02029-live-app-form-dojo]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min02029-app-form-dogwwod-dojo.png "Live app form showing Dojo"

[image-wtip-min02854-myob-no-dba]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min02854-myob-no-dba.png "MYOB and not a DBA in sight"

[image-wtip-min02940-myob-elastic]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min02940-myob-elastic-pool-usage-example.png "MYOB elastic pool usage example"

[image-wtip-min03136-learning-isvs]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min03136-myob-isv-saas-patterns-design-scale.png "Learning from MYOB and other ISVs"

[image-wtip-min04315-patterns-compose]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min04315-patterns-compose-into-e2e-saas-scenario-st-mt.png "Patterns compose into E2E SaaS scenario"

[image-wtip-min04733-canonical-hybrid]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min04733-canonical-hybrid-mt-saas-app.png "Canonical hybrid multi-tenant SaaS app"

[image-wtip-min04810-wingtip-saas-app]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min04810-saas-sample-app-descr-of-modules-links.png "Wingtip SaaS sample app"

[image-wtip-min04910-scenarios-tutorials]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min04910-scenarios-patterns-explored-tutorials.png "Scenarios and patterns explored in the tutorials"

[image-wtip-min05018-demo-tutorials-github]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min05018-demo-saas-tutorials-github-repo.png "Demo of tutorials and GitHub repo"

[image-wtip-min05038-github-wingtipsaas]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min05038-github-repo-wingtipsaas.png "GitHub repo Microsoft/WingtipSaaS"

[image-wtip-min05620-exploring-patterns]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min05620-exploring-patterns-tutorials.png "Exploring the patterns"

[image-wtip-min05744-provisioning-tenants-onboarding-1]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min05744-provisioning-tenants-connecting-run-time-1.png "Provisioning tenants and onboarding"

[image-wtip-min05858-provisioning-tenants-app-connection-2]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min05858-provisioning-tenants-connecting-run-time-2.png "Provisioning tenants and application connection"

[image-wtip-min05943-demo-management-scripts-st]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min05943-demo-management-scripts-provisioning-st.png "Demo of management scripts provisioning a single tenant"

[image-wtip-min10002-powershell-provision-catalog]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min10002-powershell-code.png "PowerShell to provision and catalog"

[image-wtip-min10330-sql-select-tenantsextended]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min10330-ssms-tenantcatalog.png "T-SQL SELECT * FROM TenantsExtended"

[image-wtip-min10436-managing-unpredictable-workloads]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min10436-managing-unpredictable-tenant-workloads.png "Managing unpredictable tenant workloads"

[image-wtip-min10639-elastic-pool-monitoring]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min10639-elastic-pool-monitoring.png "Elastic pool monitoring"

[image-wtip-min10942-load-generation]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min10942-schema-management-scale.png "Load generation and performance monitoring"

[image-wtip-min11033-schema-management-scale]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min11033-schema-manage-1000s-dbs-one.png "Schema management at scale"

[image-wtip-min11221-distributed-query]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min11221-distributed-query-all-tenants-asif-single-db.png "Distributed query across tenant databases"

[image-wtip-min11232-demo-ticket-generation]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min11232-demo-ticket-generation-distributed-query.png "Demo of ticket generation"

[image-wtip-min11246-ssms-adhoc-analytics]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min11246-tsql-adhoc-analystics-db-elastic-query.png "SSMS adhoc analytics"

[image-wtip-min11632-extract-tenant-data-sql-dw]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min11632-extract-tenant-data-analytics-db-dw.png "Extract tenant data into SQL DW"

[image-wtip-min11648-graph-daily-sale-distribution]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min11648-graph-daily-sale-contoso-concert-hall.png "Graph of daily sale distribution"

[image-wtip-min11952-wrap-up-call-action]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min11952-wrap-call-action-saasfeedback.png "Wrap up and call to action"

[image-wtip-min12042-resources-more-info]: media/saas-tenancy-video-index-wingtip-brk3120-20171011/wingtip-20171011-min12042-resources-blog-github-tutorials-get-started.png "Resources for more information"




<!-- Article link reference IDs. -->

[saas-concept-design-patterns-563e]: saas-tenancy-app-design-patterns.md

[saas-how-welcome-wingtip-app-679t]: saas-tenancy-welcome-wingtip-tickets-app.md


[video-on-youtube-com-478y]: https://www.youtube.com/watch?v=jjNmcKBVjrc&t=1

[video-on-channel9-479c]: https://channel9.msdn.com/Events/Ignite/Microsoft-Ignite-Orlando-2017/BRK3120


[resource-blog-saas-patterns-app-dev-sql-db-768h]: https://azure.microsoft.com/blog/saas-patterns-accelerate-saas-application-development-on-sql-database/


[github-wingtip-standaloneapp]: https://github.com/Microsoft/WingtipTicketsSaaS-StandaloneApp/

[github-wingtip-dbpertenant]: https://github.com/Microsoft/WingtipTicketsSaaS-DbPerTenant/

[github-wingtip-multitenantdb]: https://github.com/Microsoft/WingtipTicketsSaaS-MultiTenantDB/

