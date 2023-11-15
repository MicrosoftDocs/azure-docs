---
title: Metrics for Azure IoT Layered Network Management
# titleSuffix: Azure IoT Operations
description: Available observability metrics for Azure IoT Layered Network Management to monitor the health and performance of your solution.
author: timlt
ms.author: timlt
ms.topic: reference
ms.custom:
  - ignite-2023
ms.date: 11/1/2023

# CustomerIntent: As an IT admin or operator, I want to be able to monitor and visualize data
# on the health of my industrial assets and edge environment.
---

# Metrics for Azure IoT Layered Network Management

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Azure IoT Layered Network Management Preview provides a set of observability metrics that you can use to monitor and analyze the health of your solution.  This article lists the available metrics, and describes the meaning and usage details of each metric. 

## General metrics

> [!div class="mx-tdBreakAll"]
> | Metric name                                      | Definition                                                                                     | 
> | ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
> | server_uptime | Total time that the Layered Network Management service has been running. |
> | total_connections | Total network connections that have been initiated through the Layered Network Management service.  |

## TLS Inspector metrics

> [!div class="mx-tdBreakAll"]
> | Metric name                                      | Definition                                                                                     | 
> | ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
> | client_hello_too_large | Indicates that an unreasonably large client hello was received. |
> | tls_found | The total number of times TLS was found. |
> | tls_not_found | The total number of times TLS was not found. |
> | alpn_found | The total number of times that Application-Layer Protocol Negotiation was successful. |
> | alpn_not_found | The total number of times that Application-Layer Protocol Negotiation failed. |
> | sni_found | The total number of times that Server Name Indication was found. |
> | sni_not_found | The total number of times that Server Name Indication was not found. |
> | bytes_processed | The recorded number of bytes that the `tls_inspector` processed while analyzing for tls usage. If the connection uses TLS, this metric indicates the size of client hello. If the client hello is too large, then the recorded value will be 64KiB which is the maximum client hello size. If the connection does not use TLS, the metric is the number of bytes processed until the inspector determined that the connection was not using TLS. If the connection terminates early, nothing is recorded if there weren't sufficient bytes for either of previous cases. |

## TCP proxy metrics

> [!div class="mx-tdBreakAll"]
> | Metric name                                      | Definition                                                                                     | 
> | ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
> | downstream_cx_total | The total number of connections handled by the filter. |
> | downstream_cx_no_route | The number of connections for which no matching route was found or the cluster for the route was not found. |
> | downstream_cx_tx_bytes_total | The total bytes written to the downstream connection. |
> | downstream_cx_tx_bytes_buffered | The total bytes currently buffered to the downstream connection. |
> | downstream_cx_rx_bytes_total | The total bytes read from the downstream connection. |
> | downstream_cx_rx_bytes_buffered | The total bytes currently buffered from the downstream connection. |
> | downstream_flow_control_paused_reading_total | The total number of times that flow control paused reading from downstream. |
> | downstream_flow_control_resumed_reading_total | The total number of times that flow control resumed reading from downstream. |
> | idle_timeout | The total number of connections closed due to idle timeout. |
> | max_downstream_connection_duration | The total number of connections closed due to `max_downstream_connection_duration` timeout. |
> | on_demand_cluster_attempt | The total number of connections that requested on demand cluster. |
> | on_demand_cluster_missing | The total number of connections closed due to on demand cluster is missing. |
> | on_demand_cluster_success | The total number of connections that requested and received an on-demand cluster. |
> | on_demand_cluster_timeout | The total number of connections closed due to an on-demand cluster lookup timeout. |
> | upstream_flush_total | The total number of connections that continued to flush upstream data after the downstream connection was closed. |
> | upstream_flush_active | The total connections currently continuing to flush upstream data after the downstream connection was closed. |


## Related content

- [Configure observability](../monitor/howto-configure-observability.md)
