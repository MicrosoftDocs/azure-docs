---
layout: HubPage
hide_bc: false
title: Azure Monitor Log Data Documentation | Microsoft Docs
description: Azure Monitor can collect different sources as log data and store it for correlation and analysis using its query language.
services: azure-monitor
author: mgoedtel
manager: carmonm
ms.assetid:	
ms.service: azure-monitor
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hub-page
ms.date: 11/16/2018
ms.author: magoedte

---

<div id="main" class="v2">
    <div class="container">
        <h1>Azure Monitor log data documentation</h1>
        <p>Azure Monitor can collect different sources as log data and store it for correlation and analysis using its query language.</p>
		<p>Here we have consolidated the most relevant content on how to plan, collect, and analyze log data.</p>
        <hr style="margin: 30px 0;" />
        <ul class="pivots">
            <li>
                <a href="#products"></a>
                <ul id="products">
                    <li>
                        <a class="singlePanelNavItem selected" style="display: none" href="#indexA" data-linktype="self-bookmark"></a>
                        <ul class="panelContent singlePanelContent" id="indexA" style="border: medium; border-image: none; margin-top: 0px; display: flex; float: left;">
                            <li class="fullSpan">
                                <a href="#index1" data-linktype="self-bookmark"></a>
                                <ul class="cardsF cols cols4" id="index1" style="float: left; display: flex; width: 100%; border-bottom: 1px var(--grey-lighter) solid;">  
                                    <li>
                                        <ul class="cardsB panelContent" id="cardtypes-B" style="float: left; display: flex; width: 100%;">
                                            <li>
                                                <!-- <a href="">-->
                                                    <div class="cardSize">
                                                        <div class="cardPadding">
                                                            <div class="card">
                                                                <div class="cardImageOuter">
                                                                    <div class="cardImage">
                                                                        <img alt="" src="https://docs.microsoft.com/media/common/i_learn-about.svg" data-linktype="external">
                                                                    </div>
                                                                </div>
                                                                <div class="cardText" style="padding-left: 0px">
                                                                    <h3>Learn the fundamentals</h3> 
																	<p> 
																	    <a href="/azure/azure-monitor/overview">What is Azure Monitor?</a><br/>
                                                                        <a href="/azure/azure-monitor/azure-monitor-rebrand">Branding changes</a><br/>
                                                                        <a href="/azure/monitoring/monitoring-data-sources">Monitoring data sources</a><br/>
                                                                        <a href="/azure/log-analytics/log-analytics-service-providers">Design considerations for Service Providers</a><br/>
																	</p>
																</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                <!-- </a>-->
                                            </li>
                                            <li>
                                                <!-- <a href="">-->
                                                    <div class="cardSize">
                                                        <div class="cardPadding">
                                                            <div class="card">
                                                                <div class="cardText">
                                                                    <h3>Understand security</h3> 
																	<p>
																	    <a href="/azure/log-analytics/log-analytics-data-security">Log data</a><br/>
                                                                        <a href="/azure/log-analytics/log-analytics-personal-data-mgmt">Personal log data handling</a><br/>
                                                                        <a href="/azure/monitoring-and-diagnostics/monitoring-roles-permissions-security">Role permissions and security</a><br/>
																    </p>
																</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                <!-- </a>-->
                                            </li>
										</ul>
                                    </li>
                                    <li>
                                        <div class="cardSize">
                                            <div class="cardPadding">
                                                <div class="card">
                                                    <div class="cardText">
													<h3>Monitoring</h3>
                                                        <p>
                                                            <a href="/azure/monitoring/monitoring-data-collection">Metrics and logs</a><br/>
                                                            <a href="/azure/log-analytics/log-analytics-data-ingestion-time">Log data ingestion time</a><br/>
														</p>
														<br>
														<h3>Manage workspace</h3>
                                                        <p>
                                                            <a href="/azure/log-analytics/log-analytics-quick-create-workspace">Create workspace - Azure portal</a><br/>
                                                            <a href="/azure/log-analytics/log-analytics-quick-create-workspace-cli">Create workspace - Azure CLI</a><br/>
                                                            <a href="/azure/log-analytics/log-analytics-quick-create-workspace-posh">Create workspace - Azure PowerShell</a><br/>
                                                            <a href="/azure/log-analytics/log-analytics-manage-del-workspace">Delete workspace</a><br/>
														</p>
														<br>
                                                        <h3>Data sources</h3>
                                                        <p>
                                                            <a href="/azure/monitoring/monitoring-data-sources">Overview<br/>
                                                            <a href="/azure/log-analytics/log-analytics-data-sources-windows-events">Windows events</a><br/>
                                                            <a href="/azure/log-analytics-data-sources-performance-counters">Windows and Linux performance counters</a><br/>
                                                            <a href="/azure/log-analytics/log-analytics-data-sources-linux-applications">Linux application performance</a><br/>
                                                            <a href="/azure/log-analytics/log-analytics-data-sources-json">Custom JSON data</a><br/>
                                                            <a href="/azure/log-analytics/log-analytics-data-sources-collectd">Collectd performance data</a><br/>
                                                            <a href="/azure/log-analytics/log-analytics-data-sources-alerts-nagios-zabbix">Nagios and Zabbix alerts</a><br/>
                                                            <a href="/azure/log-analytics/log-analytics-data-sources-syslog">Syslog</a><br/>
                                                            <a href="/azure/log-analytics/log-analytics-data-sources-iis-logs">IIS logs</a><br/>
                                                            <a href="/azure/log-analytics/log-analytics-data-sources-custom-logs">Custom logs</a><br/>
                                                            <a href="/azure/log-analytics/log-analytics-custom-fields">Custom fields</a><br/>
                                                            <a href="/azure/log-analytics/log-analytics-data-collector-api">Data Collector API</a><br/>
														</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
									<li>
                                        <div class="cardSize">
                                            <div class="cardPadding">
                                                <div class="card">
                                                    <div class="cardText">
                                                        <h3>Analyze data</h3>
                                                        <p>
                                                            <a href="/azure/log-analytics/query-language/get-started-queries">Get started with queries</a><br/>
                                                            <a href="/azure/log-analytics/log-analytics-log-search">Understand Log queries</a><br/>
                                                            <a href="/azure/log-analytics/log-analytics-log-search-portals">Log query portals</a><br/>
                                                            <a href="/azure/log-analytics/query-language/query-language">Log query language reference</a><br/>
                                                            <a href="/azure/log-analytics-cross-workspace-search">Cross-resource query</a><br/>
														</p>
														<br>
                                                        <h3>Incident response</h3>
                                                        <p>
                                                            <a href="/azure/monitoring-and-diagnostics/monitoring-overview-unified-alerts">Alerts overview</a><br/>
                                                            <a href="/azure/monitoring-and-diagnostics/monitoring-overview-autoscale">Autoscale</a><br/>
                                                            <a href="/azure/monitoring-and-diagnostics/monitor-alerts-unified-log">Log alerts</a><br/>
                                                            <a href="/azure/monitoring-and-diagnostics/monitoring-activity-log-alerts-new-experience">Activity log alerts</a><br/>
                                                            <a href="/azure/monitoring-and-diagnostics/monitoring-action-groups">Action groups</a><br/>
                                                        </p>
													</div>
                                                </div>
                                            </div>
                                        </div>
								    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</div>
