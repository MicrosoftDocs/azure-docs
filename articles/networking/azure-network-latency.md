---
title: Azure network round-trip latency statistics
description: Learn about round-trip latency statistics between Azure regions.
services: networking
author: mbender-ms
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 07/02/2026
ms.author: mbender
ms.custom: references_regions,updatedFY24S2
---

# Azure network round-trip latency statistics

This article provides round-trip latency statistics between Azure regions to help you optimize your cloud architecture and deployment decisions. The data comes from continuous network monitoring across Azure's global infrastructure and represents real-world performance measurements.

Use these statistics to:

- **Plan multi-region deployments** for optimal performance
- **Select regions** that minimize latency for your users
- **Design disaster recovery strategies** with latency considerations
- **Benchmark expected performance** between specific region pairs

## What is round-trip latency?

Round-trip latency is the time it takes for a data packet to travel from one point in the network to another and back again. In the context of Azure, it measures the time taken for a packet to travel between two Azure regions. This metric is crucial for applications that require low-latency communication, such as real-time data processing, gaming, and financial transactions.

## How is latency measured?

Azure measures round-trip latency using internal network probes that continuously monitor the performance of the Azure backbone network. These probes send data packets between Azure regions and record the time taken for the packets to travel to their destination and back. The measurements are collected in 1-minute intervals, providing a detailed view of network performance over time.

The latency statistics presented in this article are based on the 50th percentile (P50) of these measurements, which represents the median round-trip time. This means that half of the measured round-trip times are below this value, providing a reliable indicator of typical network performance.


## Round-trip latency data by region

The monthly Percentile P50 round trip times between Azure regions for a 30-day window are shown in the following tabs. The latency is measured in milliseconds (ms).

The current dataset was taken on *July 2, 2026*, and it covers the 30-day period ending on *July 2, 2026*.

For readability, each table is split into tabs for groups of Azure regions. The tabs are organized by regions, and then by source region in the first column of each table. For example, the *East US* tab also shows the latency from all source regions to the two *East US* regions: *East US* and *East US 2*. 

> [!IMPORTANT]
> Monthly latency numbers across Azure regions do not change on a regular basis. You can expect an update of these tables every 6 to 9 months. Not all public Azure regions are listed in the following tables. When new regions come online, we will update this document as soon as latency data is available.
> 
> You can perform VM-to-VM latency between regions using [test Virtual Machines](../virtual-network/virtual-network-test-latency.md) in your Azure subscription.

#### [North America / South America](#tab/Americas)

Latency tables for Americas regions including US, Canada, and Brazil.

Use the following tabs to view latency statistics for each region.

#### [Europe](#tab/Europe)

Latency tables for European regions.

Use the following tabs to view latency statistics for each region.

#### [Asia-Pacific (APAC)](#tab/APAC)

Latency tables for Australia, Asia, and Pacific regions including and Australia, Japan, Korea, and India.

Use the following tabs to view latency statistics for each region.

#### [Middle East / Africa](#tab/MEA)

Latency tables for Middle East / Africa regions including UAE, South Africa, Israel, and Qatar.

Use the following tabs to view latency statistics for each region.

---

#### [West US](#tab/WestUS/Americas)


| Source | West Central US | West US | West US 2 | West US 3 |
|---|---|---|---|---|
| Australia Central | 167 | 145 | 167 | 150 |
| Australia Central 2 | 167 | 145 | 166 | 149 |
| Australia East | 167 | 147 | 167 | 155 |
| Australia Southeast | 173 | 151 | 172 | 158 |
| Brazil South | 157 | 172 | 179 | 164 |
| Canada Central | 39 | 62 | 60 | 72 |
| Canada East | 54 | 74 | 72 | 82 |
| Central India | 240 | 223 | 216 | 237 |
| Central US | 19 | 42 | 40 | 45 |
| East Asia | 162 | 148 | 141 | 156 |
| East US | 56 | 73 | 76 | 61 |
| East US 2 | 49 | 69 | 70 | 56 |
| France Central | 128 | 142 | 149 | 133 |
| France South | 128 | 147 | 149 | 141 |
| Germany North | 136 | 155 | 157 | 146 |
| Germany West Central | 134 | 149 | 156 | 146 |
| Indonesia Central | 196 | 182 | 175 | 194 |
| Israel Central | 161 | 183 | 183 | 171 |
| Italy North | 137 | 160 | 156 | 152 |
| Japan East | 122 | 108 | 100 | 113 |
| Japan West | 129 | 115 | 107 | 119 |
| Jio India West |  |  |  |  |
| Korea Central | 147 | 131 | 124 | 137 |
| Korea South | 140 | 128 | 121 | 132 |
| Malaysia West | 188 | 174 | 167 | 187 |
| Mexico Central | 44 | 52 | 70 | 40 |
| New Zealand North | 147 | 132 | 137 | 134 |
| North Central US | 27 | 49 | 47 | 53 |
| North Europe | 118 | 135 | 137 | 128 |
| Norway East | 132 | 155 | 152 | 148 |
| Norway West | 130 | 153 | 154 | 144 |
| Poland Central | 146 | 164 | 167 | 152 |
| South Africa North | 259 | 273 | 280 | 265 |
| South Africa West | 243 | 257 | 264 | 247 |
| South Central US | 27 | 35 | 55 | 22 |
| South India | 215 | 202 | 195 | 213 |
| Southeast Asia | 187 | 172 | 166 | 185 |
| Sweden Central | 139 | 157 | 158 | 154 |
| Switzerland North | 137 | 159 | 158 | 149 |
| Switzerland West | 139 | 159 | 158 | 151 |
| UAE Central | 230 | 245 | 245 | 224 |
| UAE North | 234 | 248 | 254 | 226 |
| UK South | 123 | 140 | 143 | 135 |
| UK West | 128 | 143 | 148 | 137 |
| West Central US |  | 26 | 25 | 35 |
| West Europe | 129 | 152 | 147 | 144 |
| West US | 33 |  | 32 | 26 |
| West US 2 | 30 | 30 |  | 46 |
| West US 3 | 34 | 18 | 40 |  |

#### [Central US](#tab/CentralUS/Americas)


| Source | Central US | North Central US | South Central US |
|---|---|---|---|
| Australia Central | 181 | 188 | 166 |
| Australia Central 2 | 180 | 187 | 166 |
| Australia East | 182 | 189 | 168 |
| Australia Southeast | 189 | 198 | 174 |
| Brazil South | 152 | 141 | 142 |
| Canada Central | 29 | 19 | 54 |
| Canada East | 41 | 32 | 64 |
| Central India | 230 | 222 | 245 |
| Central US |  | 15 | 26 |
| East Asia | 177 | 184 | 172 |
| East US | 33 | 24 | 41 |
| East US 2 | 33 | 24 | 33 |
| France Central | 118 | 106 | 112 |
| France South | 112 | 101 | 120 |
| Germany North | 123 | 113 | 128 |
| Germany West Central | 122 | 111 | 125 |
| Indonesia Central | 211 | 218 | 211 |
| Israel Central | 148 | 138 | 152 |
| Italy North | 126 | 112 | 132 |
| Japan East | 136 | 144 | 128 |
| Japan West | 143 | 150 | 135 |
| Jio India West |  |  |  |
| Korea Central | 159 | 167 | 154 |
| Korea South | 155 | 161 | 149 |
| Malaysia West | 203 | 210 | 203 |
| Mexico Central | 45 | 57 | 23 |
| New Zealand North | 162 | 170 | 149 |
| North Central US | 15 |  | 38 |
| North Europe | 104 | 92 | 105 |
| Norway East | 123 | 112 | 127 |
| Norway West | 124 | 111 | 125 |
| Poland Central | 130 | 119 | 134 |
| South Africa North | 243 | 234 | 243 |
| South Africa West | 228 | 218 | 228 |
| South Central US | 26 | 38 |  |
| South India | 230 | 241 | 230 |
| Southeast Asia | 199 | 207 | 200 |
| Sweden Central | 128 | 118 | 132 |
| Switzerland North | 125 | 115 | 131 |
| Switzerland West | 129 | 112 | 133 |
| UAE Central | 196 | 189 | 208 |
| UAE North | 195 | 191 | 208 |
| UK South | 108 | 97 | 113 |
| UK West | 112 | 101 | 117 |
| West Central US | 19 | 27 | 27 |
| West Europe | 117 | 103 | 123 |
| West US | 49 | 55 | 43 |
| West US 2 | 45 | 51 | 59 |
| West US 3 | 43 | 52 | 21 |

#### [East US](#tab/EastUS/Americas)


| Source | East US | East US 2 |
|---|---|---|
| Australia Central | 201 | 198 |
| Australia Central 2 | 201 | 197 |
| Australia East | 203 | 201 |
| Australia Southeast | 209 | 208 |
| Brazil South | 120 | 120 |
| Canada Central | 19 | 22 |
| Canada East | 33 | 35 |
| Central India | 202 | 204 |
| Central US | 29 | 32 |
| East Asia | 211 | 206 |
| East US |  | 9 |
| East US 2 | 10 |  |
| France Central | 89 | 85 |
| France South | 85 | 90 |
| Germany North | 94 | 98 |
| Germany West Central | 95 | 92 |
| Indonesia Central | 245 | 240 |
| Israel Central | 122 | 126 |
| Italy North | 96 | 102 |
| Japan East | 171 | 166 |
| Japan West | 178 | 172 |
| Jio India West |  |  |
| Korea Central | 193 | 188 |
| Korea South | 189 | 183 |
| Malaysia West | 237 | 232 |
| Mexico Central | 53 | 48 |
| New Zealand North | 182 | 178 |
| North Central US | 20 | 23 |
| North Europe | 74 | 77 |
| Norway East | 95 | 100 |
| Norway West | 93 | 97 |
| Poland Central | 101 | 109 |
| South Africa North | 220 | 218 |
| South Africa West | 204 | 201 |
| South Central US | 36 | 31 |
| South India | 231 | 233 |
| Southeast Asia | 237 | 234 |
| Sweden Central | 98 | 105 |
| Switzerland North | 99 | 98 |
| Switzerland West | 96 | 98 |
| UAE Central | 176 | 189 |
| UAE North | 183 | 190 |
| UK South | 79 | 82 |
| UK West | 82 | 86 |
| West Central US | 53 | 48 |
| West Europe | 87 | 92 |
| West US | 74 | 72 |
| West US 2 | 79 | 74 |
| West US 3 | 57 | 54 |

#### [Canada](#tab/Canada/Americas)


| Source | Canada Central | Canada East |
|---|---|---|
| Australia Central | 200 | 207 |
| Australia Central 2 | 200 | 207 |
| Australia East | 203 | 214 |
| Australia Southeast | 211 | 218 |
| Brazil South | 133 | 129 |
| Canada Central |  | 14 |
| Canada East | 15 |  |
| Central India | 202 | 199 |
| Central US | 29 | 35 |
| East Asia | 197 | 205 |
| East US | 23 | 31 |
| East US 2 | 22 | 30 |
| France Central | 89 | 85 |
| France South | 86 | 82 |
| Germany North | 100 | 97 |
| Germany West Central | 99 | 94 |
| Indonesia Central | 231 | 238 |
| Israel Central | 124 | 120 |
| Italy North | 98 | 94 |
| Japan East | 156 | 165 |
| Japan West | 163 | 171 |
| Jio India West |  |  |
| Korea Central | 180 | 188 |
| Korea South | 174 | 181 |
| Malaysia West | 225 | 230 |
| Mexico Central | 69 | 76 |
| New Zealand North | 182 | 191 |
| North Central US | 19 | 26 |
| North Europe | 78 | 74 |
| Norway East | 101 | 97 |
| Norway West | 95 | 91 |
| Poland Central | 108 | 104 |
| South Africa North | 230 | 226 |
| South Africa West | 214 | 210 |
| South Central US | 53 | 60 |
| South India | 224 | 215 |
| Southeast Asia | 226 | 231 |
| Sweden Central | 106 | 101 |
| Switzerland North | 98 | 93 |
| Switzerland West | 96 | 93 |
| UAE Central | 163 | 160 |
| UAE North | 175 | 171 |
| UK South | 81 | 77 |
| UK West | 84 | 80 |
| West Central US | 39 | 48 |
| West Europe | 93 | 89 |
| West US | 66 | 74 |
| West US 2 | 64 | 72 |
| West US 3 | 70 | 77 |

#### [South America](#tab/SouthAmerica/Americas)


| Source | Brazil South | Mexico Central |
|---|---|---|
| Australia Central | 300 | 182 |
| Australia Central 2 | 300 | 182 |
| Australia East | 298 | 183 |
| Australia Southeast | 309 | 190 |
| Brazil South |  | 157 |
| Canada Central | 132 | 70 |
| Canada East | 135 | 79 |
| Central India | 306 | 265 |
| Central US | 149 | 45 |
| East Asia | 314 | 189 |
| East US | 121 | 56 |
| East US 2 | 119 | 48 |
| France Central | 190 | 127 |
| France South | 187 | 131 |
| Germany North | 195 | 140 |
| Germany West Central | 197 | 140 |
| Indonesia Central | 342 | 230 |
| Israel Central | 223 | 169 |
| Italy North | 203 | 145 |
| Japan East | 264 | 145 |
| Japan West | 270 | 151 |
| Jio India West |  | 267 |
| Korea Central | 285 | 168 |
| Korea South | 278 | 160 |
| Malaysia West | 339 | 223 |
| Mexico Central | 156 |  |
| New Zealand North | 284 | 166 |
| North Central US | 139 | 56 |
| North Europe | 175 | 118 |
| Norway East | 196 | 142 |
| Norway West | 195 | 140 |
| Poland Central | 203 | 148 |
| South Africa North | 321 | 260 |
| South Africa West | 306 | 243 |
| South Central US | 139 | 22 |
| South India | 318 | 246 |
| Southeast Asia | 338 | 219 |
| Sweden Central | 200 | 145 |
| Switzerland North | 201 | 141 |
| Switzerland West | 201 | 147 |
| UAE Central | 274 | 207 |
| UAE North | 281 | 210 |
| UK South | 181 | 127 |
| UK West | 186 | 131 |
| West Central US | 157 | 44 |
| West Europe | 191 | 138 |
| West US | 174 | 57 |
| West US 2 | 180 | 74 |
| West US 3 | 162 | 38 |

#### [Western Europe](#tab/WesternEurope/Europe)


| Source | France Central | France South | Switzerland North | Switzerland West | West Europe |
|---|---|---|---|---|---|
| Australia Central | 246 | 235 | 245 | 242 | 254 |
| Australia Central 2 | 245 | 234 | 245 | 241 | 253 |
| Australia East | 261 | 243 | 264 | 269 | 265 |
| Australia Southeast | 258 | 225 | 237 | 234 | 265 |
| Brazil South | 191 | 191 | 202 | 199 | 187 |
| Canada Central | 90 | 86 | 99 | 94 | 91 |
| Canada East | 88 | 85 | 95 | 92 | 89 |
| Central India | 139 | 124 | 123 | 116 | 138 |
| Central US | 117 | 111 | 125 | 120 | 112 |
| East Asia | 191 | 170 | 183 | 178 | 200 |
| East US | 90 | 89 | 101 | 93 | 85 |
| East US 2 | 86 | 91 | 100 | 96 | 90 |
| France Central |  | 14 | 17 | 14 | 13 |
| France South | 15 |  | 14 | 10 | 23 |
| Germany North | 19 | 26 | 16 | 19 | 14 |
| Germany West Central | 12 | 19 | 9 | 13 | 11 |
| Indonesia Central | 165 | 153 | 163 | 163 | 172 |
| Israel Central | 55 | 41 | 51 | 54 | 69 |
| Italy North | 21 | 16 | 8 | 11 | 21 |
| Japan East | 228 | 210 | 234 | 235 | 232 |
| Japan West | 227 | 202 | 214 | 210 | 232 |
| Jio India West |  |  |  |  |  |
| Korea Central | 239 | 202 | 244 | 243 | 241 |
| Korea South | 237 | 196 | 207 | 203 | 237 |
| Malaysia West | 166 | 145 | 156 | 152 | 171 |
| Mexico Central | 128 | 131 | 141 | 138 | 132 |
| New Zealand North | 255 | 254 | 265 | 261 | 258 |
| North Central US | 106 | 101 | 114 | 110 | 101 |
| North Europe | 21 | 30 | 33 | 36 | 17 |
| Norway East | 31 | 38 | 28 | 31 | 22 |
| Norway West | 26 | 35 | 32 | 35 | 22 |
| Poland Central | 31 | 35 | 27 | 30 | 23 |
| South Africa North | 159 | 157 | 167 | 164 | 166 |
| South Africa West | 143 | 142 | 152 | 148 | 150 |
| South Central US | 114 | 118 | 130 | 126 | 119 |
| South India | 153 | 134 | 143 | 138 | 151 |
| Southeast Asia | 164 | 150 | 163 | 162 | 171 |
| Sweden Central | 38 | 44 | 33 | 37 | 26 |
| Switzerland North | 17 | 13 |  | 7 | 17 |
| Switzerland West | 19 | 15 | 11 |  | 27 |
| UAE Central | 92 | 80 | 90 | 87 | 99 |
| UAE North | 114 | 102 | 92 | 99 | 112 |
| UK South | 11 | 20 | 24 | 19 | 12 |
| UK West | 14 | 23 | 29 | 24 | 16 |
| West Central US | 128 | 127 | 138 | 131 | 122 |
| West Europe | 19 | 29 | 23 | 26 |  |
| West US | 150 | 153 | 163 | 158 | 153 |
| West US 2 | 153 | 154 | 163 | 155 | 147 |
| West US 3 | 132 | 138 | 148 | 142 | 137 |

#### [Central Europe](#tab/CentralEurope/Europe)


| Source | Germany North | Germany West Central | Italy North | Poland Central |
|---|---|---|---|---|
| Australia Central | 257 | 251 | 247 | 266 |
| Australia Central 2 | 257 | 249 | 249 | 265 |
| Australia East | 275 | 268 | 265 | 281 |
| Australia Southeast | 270 | 266 | 265 | 278 |
| Brazil South | 196 | 198 | 204 | 204 |
| Canada Central | 100 | 99 | 99 | 108 |
| Canada East | 98 | 96 | 96 | 106 |
| Central India | 137 | 143 | 138 | 151 |
| Central US | 122 | 122 | 126 | 129 |
| East Asia | 193 | 196 | 188 | 203 |
| East US | 96 | 95 | 100 | 102 |
| East US 2 | 98 | 93 | 104 | 111 |
| France Central | 18 | 12 | 21 | 30 |
| France South | 26 | 20 | 18 | 36 |
| Germany North |  | 11 | 21 | 17 |
| Germany West Central | 11 |  | 14 | 23 |
| Indonesia Central | 185 | 172 | 177 | 196 |
| Israel Central | 64 | 61 | 48 | 63 |
| Italy North | 20 | 14 |  | 26 |
| Japan East | 239 | 235 | 232 | 247 |
| Japan West | 226 | 224 | 235 | 247 |
| Jio India West |  |  | 140 | 164 |
| Korea Central | 247 | 243 | 243 | 255 |
| Korea South | 219 | 237 | 211 | 227 |
| Malaysia West | 167 | 165 | 166 | 187 |
| Mexico Central | 140 | 141 | 146 | 148 |
| New Zealand North | 268 | 270 | 270 | 277 |
| North Central US | 112 | 111 | 114 | 119 |
| North Europe | 29 | 28 | 38 | 36 |
| Norway East | 20 | 22 | 33 | 28 |
| Norway West | 27 | 27 | 37 | 34 |
| Poland Central | 16 | 23 | 27 |  |
| South Africa North | 171 | 165 | 171 | 184 |
| South Africa West | 156 | 149 | 156 | 169 |
| South Central US | 126 | 125 | 135 | 135 |
| South India | 141 | 152 | 141 | 160 |
| Southeast Asia | 175 | 169 | 166 | 185 |
| Sweden Central | 21 | 28 | 37 | 24 |
| Switzerland North | 16 | 9 | 8 | 27 |
| Switzerland West | 25 | 16 | 14 | 37 |
| UAE Central | 103 | 98 | 97 | 112 |
| UAE North | 106 | 120 | 113 | 115 |
| UK South | 22 | 17 | 28 | 29 |
| UK West | 24 | 21 | 34 | 31 |
| West Central US | 135 | 135 | 137 | 146 |
| West Europe | 18 | 17 | 29 | 26 |
| West US | 160 | 157 | 164 | 169 |
| West US 2 | 161 | 159 | 164 | 172 |
| West US 3 | 144 | 146 | 151 | 151 |

#### [Nordic Countries](#tab/Nordic/Europe)


| Source | Norway East | Norway West | Sweden Central |
|---|---|---|---|
| Australia Central | 269 | 267 | 275 |
| Australia Central 2 | 269 | 266 | 274 |
| Australia East | 281 | 277 | 287 |
| Australia Southeast | 260 | 257 | 281 |
| Brazil South | 197 | 195 | 205 |
| Canada Central | 102 | 95 | 108 |
| Canada East | 99 | 92 | 104 |
| Central India | 157 | 150 | 164 |
| Central US | 123 | 122 | 130 |
| East Asia | 207 | 202 | 218 |
| East US | 95 | 92 | 101 |
| East US 2 | 100 | 97 | 109 |
| France Central | 30 | 24 | 40 |
| France South | 38 | 34 | 46 |
| Germany North | 20 | 26 | 23 |
| Germany West Central | 23 | 27 | 29 |
| Indonesia Central | 188 | 185 | 205 |
| Israel Central | 79 | 82 | 84 |
| Italy North | 32 | 36 | 37 |
| Japan East | 245 | 241 | 251 |
| Japan West | 238 | 234 | 251 |
| Jio India West |  |  |  |
| Korea Central | 254 | 234 | 260 |
| Korea South | 231 | 228 | 251 |
| Malaysia West | 180 | 177 | 194 |
| Mexico Central | 142 | 139 | 146 |
| New Zealand North | 271 | 267 | 275 |
| North Central US | 113 | 113 | 119 |
| North Europe | 29 | 27 | 35 |
| Norway East |  | 10 | 13 |
| Norway West | 11 |  | 18 |
| Poland Central | 28 | 34 | 26 |
| South Africa North | 184 | 180 | 189 |
| South Africa West | 168 | 164 | 172 |
| South Central US | 126 | 123 | 133 |
| South India | 156 | 150 | 172 |
| Southeast Asia | 185 | 181 | 191 |
| Sweden Central | 12 | 16 |  |
| Switzerland North | 28 | 31 | 35 |
| Switzerland West | 39 | 43 | 45 |
| UAE Central | 115 | 112 | 131 |
| UAE North | 119 | 122 | 144 |
| UK South | 24 | 17 | 32 |
| UK West | 29 | 22 | 37 |
| West Central US | 132 | 130 | 139 |
| West Europe | 27 | 26 | 33 |
| West US | 160 | 158 | 164 |
| West US 2 | 158 | 156 | 166 |
| West US 3 | 147 | 142 | 153 |

#### [UK / Northern Europe](#tab/NorthernEurope/Europe)


| Source | North Europe | UK South | UK West |
|---|---|---|---|
| Australia Central | 259 | 251 | 255 |
| Australia Central 2 | 259 | 249 | 252 |
| Australia East | 267 | 265 | 266 |
| Australia Southeast | 264 | 261 | 263 |
| Brazil South | 174 | 182 | 186 |
| Canada Central | 77 | 81 | 83 |
| Canada East | 76 | 80 | 82 |
| Central India | 149 | 140 | 145 |
| Central US | 103 | 108 | 111 |
| East Asia | 230 | 197 | 200 |
| East US | 74 | 80 | 81 |
| East US 2 | 77 | 83 | 85 |
| France Central | 19 | 10 | 14 |
| France South | 29 | 20 | 22 |
| Germany North | 27 | 22 | 24 |
| Germany West Central | 26 | 17 | 20 |
| Indonesia Central | 188 | 180 | 184 |
| Israel Central | 83 | 58 | 60 |
| Italy North | 35 | 27 | 32 |
| Japan East | 228 | 228 | 233 |
| Japan West | 229 | 228 | 233 |
| Jio India West |  |  |  |
| Korea Central | 237 | 239 | 241 |
| Korea South | 232 | 233 | 218 |
| Malaysia West | 180 | 171 | 174 |
| Mexico Central | 118 | 127 | 130 |
| New Zealand North | 245 | 254 | 258 |
| North Central US | 91 | 98 | 100 |
| North Europe |  | 13 | 17 |
| Norway East | 28 | 24 | 28 |
| Norway West | 27 | 18 | 22 |
| Poland Central | 35 | 30 | 30 |
| South Africa North | 172 | 163 | 165 |
| South Africa West | 156 | 148 | 149 |
| South Central US | 104 | 113 | 116 |
| South India | 160 | 149 | 153 |
| Southeast Asia | 176 | 169 | 173 |
| Sweden Central | 32 | 30 | 35 |
| Switzerland North | 31 | 24 | 29 |
| Switzerland West | 42 | 24 | 29 |
| UAE Central | 108 | 97 | 101 |
| UAE North | 128 | 119 | 122 |
| UK South | 13 |  | 7 |
| UK West | 17 | 8 |  |
| West Central US | 115 | 126 | 128 |
| West Europe | 21 | 17 | 19 |
| West US | 138 | 147 | 150 |
| West US 2 | 142 | 148 | 152 |
| West US 3 | 124 | 133 | 135 |

#### [Australia / New Zealand](#tab/Australasia/APAC)


| Source | Australia Central | Australia Central 2 | Australia East | Australia Southeast | New Zealand North |
|---|---|---|---|---|---|
| Australia Central |  | 3 | 8 | 15 | 32 |
| Australia Central 2 | 3 |  | 8 | 12 | 33 |
| Australia East | 11 | 9 |  | 20 | 29 |
| Australia Southeast | 15 | 13 | 16 |  | 40 |
| Brazil South | 301 | 300 | 297 | 309 | 285 |
| Canada Central | 201 | 200 | 199 | 210 | 183 |
| Canada East | 209 | 208 | 213 | 221 | 192 |
| Central India | 153 | 152 | 151 | 144 | 171 |
| Central US | 179 | 180 | 178 | 188 | 163 |
| East Asia | 122 | 122 | 118 | 118 | 143 |
| East US | 204 | 201 | 199 | 213 | 183 |
| East US 2 | 198 | 198 | 197 | 208 | 180 |
| France Central | 246 | 245 | 255 | 258 | 256 |
| France South | 235 | 234 | 231 | 225 | 256 |
| Germany North | 257 | 257 | 267 | 249 | 270 |
| Germany West Central | 251 | 248 | 265 | 267 | 269 |
| Indonesia Central | 110 | 110 | 108 | 100 | 132 |
| Israel Central | 273 | 272 | 269 | 263 | 293 |
| Italy North | 246 | 248 | 260 | 265 | 270 |
| Japan East | 108 | 107 | 103 | 114 | 128 |
| Japan West | 113 | 113 | 110 | 120 | 136 |
| Jio India West |  |  |  |  | 186 |
| Korea Central | 129 | 127 | 127 | 137 | 151 |
| Korea South | 122 | 122 | 125 | 136 | 143 |
| Malaysia West | 103 | 102 | 99 | 92 | 124 |
| Mexico Central | 183 | 182 | 179 | 190 | 167 |
| New Zealand North | 31 | 31 | 28 | 39 |  |
| North Central US | 188 | 187 | 187 | 198 | 170 |
| North Europe | 262 | 259 | 263 | 264 | 247 |
| Norway East | 269 | 268 | 273 | 259 | 274 |
| Norway West | 268 | 267 | 265 | 257 | 269 |
| Poland Central | 266 | 265 | 276 | 278 | 278 |
| South Africa North | 274 | 274 | 269 | 265 | 294 |
| South Africa West | 289 | 289 | 286 | 282 | 310 |
| South Central US | 165 | 165 | 161 | 173 | 151 |
| South India | 130 | 129 | 128 | 121 | 151 |
| Southeast Asia | 99 | 98 | 96 | 90 | 119 |
| Sweden Central | 274 | 273 | 279 | 282 | 275 |
| Switzerland North | 245 | 244 | 262 | 262 | 266 |
| Switzerland West | 249 | 248 | 268 | 249 | 263 |
| UAE Central | 172 | 171 | 168 | 163 | 193 |
| UAE North | 171 | 171 | 168 | 163 | 192 |
| UK South | 252 | 249 | 260 | 263 | 256 |
| UK West | 256 | 253 | 262 | 266 | 259 |
| West Central US | 168 | 167 | 162 | 173 | 148 |
| West Europe | 260 | 258 | 270 | 268 | 259 |
| West US | 151 | 150 | 145 | 156 | 133 |
| West US 2 | 171 | 170 | 165 | 176 | 138 |
| West US 3 | 148 | 148 | 145 | 156 | 133 |

#### [Japan](#tab/Japan/APAC)


| Source | Japan East | Japan West |
|---|---|---|
| Australia Central | 108 | 114 |
| Australia Central 2 | 108 | 114 |
| Australia East | 105 | 111 |
| Australia Southeast | 115 | 120 |
| Brazil South | 265 | 272 |
| Canada Central | 157 | 164 |
| Canada East | 169 | 175 |
| Central India | 127 | 121 |
| Central US | 137 | 143 |
| East Asia | 49 | 49 |
| East US | 172 | 178 |
| East US 2 | 167 | 173 |
| France Central | 228 | 228 |
| France South | 216 | 203 |
| Germany North | 239 | 227 |
| Germany West Central | 235 | 222 |
| Indonesia Central | 84 | 79 |
| Israel Central | 247 | 241 |
| Italy North | 234 | 234 |
| Japan East |  | 11 |
| Japan West | 11 |  |
| Jio India West |  |  |
| Korea Central | 31 | 20 |
| Korea South | 22 | 14 |
| Malaysia West | 77 | 71 |
| Mexico Central | 145 | 151 |
| New Zealand North | 127 | 134 |
| North Central US | 144 | 150 |
| North Europe | 229 | 231 |
| Norway East | 245 | 240 |
| Norway West | 241 | 235 |
| Poland Central | 248 | 247 |
| South Africa North | 248 | 241 |
| South Africa West | 265 | 257 |
| South Central US | 129 | 134 |
| South India | 105 | 99 |
| Southeast Asia | 74 | 69 |
| Sweden Central | 251 | 249 |
| Switzerland North | 235 | 214 |
| Switzerland West | 243 | 213 |
| UAE Central | 146 | 139 |
| UAE North | 148 | 138 |
| UK South | 229 | 229 |
| UK West | 234 | 234 |
| West Central US | 122 | 129 |
| West Europe | 238 | 236 |
| West US | 110 | 120 |
| West US 2 | 103 | 109 |
| West US 3 | 112 | 118 |

#### [Korea](#tab/Korea/APAC)


| Source | Korea Central | Korea South |
|---|---|---|
| Australia Central | 129 | 122 |
| Australia Central 2 | 128 | 122 |
| Australia East | 135 | 127 |
| Australia Southeast | 138 | 136 |
| Brazil South | 288 | 278 |
| Canada Central | 180 | 173 |
| Canada East | 190 | 185 |
| Central India | 124 | 114 |
| Central US | 159 | 156 |
| East Asia | 39 | 33 |
| East US | 193 | 188 |
| East US 2 | 188 | 184 |
| France Central | 238 | 234 |
| France South | 202 | 196 |
| Germany North | 247 | 219 |
| Germany West Central | 246 | 238 |
| Indonesia Central | 78 | 72 |
| Israel Central | 240 | 234 |
| Italy North | 242 | 210 |
| Japan East | 30 | 22 |
| Japan West | 19 | 13 |
| Jio India West |  |  |
| Korea Central |  | 9 |
| Korea South | 9 |  |
| Malaysia West | 69 | 64 |
| Mexico Central | 167 | 160 |
| New Zealand North | 150 | 141 |
| North Central US | 166 | 160 |
| North Europe | 238 | 233 |
| Norway East | 254 | 230 |
| Norway West | 234 | 229 |
| Poland Central | 255 | 227 |
| South Africa North | 241 | 235 |
| South Africa West | 257 | 251 |
| South Central US | 152 | 149 |
| South India | 98 | 94 |
| Southeast Asia | 68 | 64 |
| Sweden Central | 259 | 252 |
| Switzerland North | 243 | 206 |
| Switzerland West | 247 | 206 |
| UAE Central | 139 | 139 |
| UAE North | 138 | 133 |
| UK South | 239 | 232 |
| UK West | 242 | 220 |
| West Central US | 145 | 139 |
| West Europe | 248 | 242 |
| West US | 138 | 131 |
| West US 2 | 128 | 125 |
| West US 3 | 135 | 132 |

#### [India](#tab/India/APAC)


| Source | Central India | Jio India West | South India |
|---|---|---|---|
| Australia Central | 149 |  | 130 |
| Australia Central 2 | 148 |  | 129 |
| Australia East | 154 |  | 137 |
| Australia Southeast | 141 |  | 122 |
| Brazil South | 307 |  | 321 |
| Canada Central | 201 |  | 226 |
| Canada East | 201 |  | 215 |
| Central India |  |  | 23 |
| Central US | 226 |  | 229 |
| East Asia | 87 |  | 67 |
| East US | 205 |  | 238 |
| East US 2 | 203 |  | 235 |
| France Central | 135 |  | 154 |
| France South | 118 |  | 135 |
| Germany North | 134 |  | 142 |
| Germany West Central | 141 |  | 153 |
| Indonesia Central | 70 | 85 | 50 |
| Israel Central | 150 |  | 156 |
| Italy North | 133 |  | 138 |
| Japan East | 124 |  | 105 |
| Japan West | 118 |  | 98 |
| Jio India West |  |  |  |
| Korea Central | 120 |  | 100 |
| Korea South | 114 |  | 95 |
| Malaysia West | 60 | 77 | 42 |
| Mexico Central | 263 |  | 246 |
| New Zealand North | 170 | 185 | 149 |
| North Central US | 218 |  | 240 |
| North Europe | 148 |  | 163 |
| Norway East | 153 |  | 163 |
| Norway West | 148 |  | 151 |
| Poland Central | 147 |  | 160 |
| South Africa North | 135 |  | 148 |
| South Africa West | 151 |  | 164 |
| South Central US | 243 |  | 229 |
| South India | 21 |  |  |
| Southeast Asia | 60 |  | 43 |
| Sweden Central | 159 |  | 172 |
| Switzerland North | 118 |  | 141 |
| Switzerland West | 121 |  | 148 |
| UAE Central | 34 |  | 48 |
| UAE North | 32 |  | 45 |
| UK South | 134 |  | 150 |
| UK West | 142 |  | 153 |
| West Central US | 235 |  | 215 |
| West Europe | 142 |  | 154 |
| West US | 227 |  | 203 |
| West US 2 | 219 |  | 197 |
| West US 3 | 232 |  | 212 |

#### [Asia](#tab/Asia/APAC)


| Source | East Asia | Malaysia West | Southeast Asia |
|---|---|---|---|
| Australia Central | 122 | 103 | 98 |
| Australia Central 2 | 123 | 102 | 98 |
| Australia East | 125 | 99 | 96 |
| Australia Southeast | 119 | 93 | 89 |
| Brazil South | 318 | 340 | 338 |
| Canada Central | 198 | 225 | 221 |
| Canada East | 207 | 229 | 230 |
| Central India | 90 | 60 | 59 |
| Central US | 177 | 202 | 198 |
| East Asia |  | 35 | 34 |
| East US | 212 | 237 | 235 |
| East US 2 | 207 | 232 | 228 |
| France Central | 191 | 166 | 160 |
| France South | 171 | 145 | 142 |
| Germany North | 194 | 168 | 173 |
| Germany West Central | 195 | 171 | 167 |
| Indonesia Central | 47 | 21 | 17 |
| Israel Central | 209 | 183 | 179 |
| Italy North | 186 | 166 | 161 |
| Japan East | 49 | 76 | 72 |
| Japan West | 48 | 71 | 66 |
| Jio India West |  | 77 |  |
| Korea Central | 39 | 69 | 65 |
| Korea South | 34 | 64 | 61 |
| Malaysia West | 35 |  | 9 |
| Mexico Central | 189 | 223 | 216 |
| New Zealand North | 142 | 122 | 118 |
| North Central US | 184 | 211 | 206 |
| North Europe | 232 | 180 | 176 |
| Norway East | 213 | 180 | 184 |
| Norway West | 203 | 177 | 176 |
| Poland Central | 203 | 186 | 183 |
| South Africa North | 211 | 185 | 180 |
| South Africa West | 227 | 202 | 196 |
| South Central US | 172 | 204 | 199 |
| South India | 68 | 42 | 38 |
| Southeast Asia | 40 | 9 |  |
| Sweden Central | 212 | 194 | 189 |
| Switzerland North | 184 | 156 | 160 |
| Switzerland West | 183 | 152 | 164 |
| UAE Central | 113 | 84 | 79 |
| UAE North | 108 | 82 | 80 |
| UK South | 201 | 171 | 167 |
| UK West | 198 | 175 | 170 |
| West Central US | 162 | 188 | 184 |
| West Europe | 206 | 167 | 174 |
| West US | 154 | 174 | 174 |
| West US 2 | 146 | 167 | 167 |
| West US 3 | 155 | 186 | 181 |

#### [Middle East](#tab/MiddleEast/MEA)


| Source | Israel Central | Qatar Central | UAE Central | UAE North |
|---|---|---|---|---|
| Australia Central | 273 | 0 | 173 | 171 |
| Australia Central 2 | 272 | 0 | 171 | 170 |
| Australia East | 273 | 0 | 173 | 174 |
| Australia Southeast | 263 | 0 | 163 | 163 |
| Brazil South | 224 | 0 | 276 | 283 |
| Canada Central | 125 | 0 | 164 | 175 |
| Canada East | 124 | 0 | 169 | 174 |
| Central India | 153 | 0 | 37 | 34 |
| Central US | 148 | 0 | 193 | 195 |
| East Asia | 208 | 0 | 113 | 107 |
| East US | 127 | 0 | 180 | 184 |
| East US 2 | 126 | 0 | 189 | 191 |
| France Central | 54 | 0 | 92 | 114 |
| France South | 41 | 0 | 80 | 102 |
| Germany North | 64 | 0 | 103 | 113 |
| Germany West Central | 60 | 0 | 98 | 119 |
| Indonesia Central | 191 | 0 | 92 | 91 |
| Israel Central |  | 0 | 118 | 120 |
| Italy North | 47 | 0 | 97 | 112 |
| Japan East | 246 | 0 | 146 | 146 |
| Japan West | 240 | 0 | 139 | 138 |
| Jio India West | 161 |  |  |  |
| Korea Central | 240 | 0 | 138 | 138 |
| Korea South | 234 | 0 | 139 | 133 |
| Malaysia West | 183 | 0 | 84 | 82 |
| Mexico Central | 169 | 0 | 207 | 210 |
| New Zealand North | 292 | 0 | 192 | 190 |
| North Central US | 138 | 0 | 189 | 191 |
| North Europe | 84 | 0 | 109 | 128 |
| Norway East | 79 | 0 | 114 | 117 |
| Norway West | 83 | 0 | 112 | 124 |
| Poland Central | 62 | 0 | 111 | 114 |
| South Africa North | 195 | 0 | 108 | 107 |
| South Africa West | 179 | 0 | 125 | 123 |
| South Central US | 152 | 0 | 202 | 208 |
| South India | 157 | 0 | 49 | 45 |
| Southeast Asia | 180 | 0 | 81 | 79 |
| Sweden Central | 82 | 0 | 119 | 143 |
| Switzerland North | 51 | 0 | 90 | 92 |
| Switzerland West | 58 | 0 | 90 | 101 |
| UAE Central | 118 | 0 |  | 6 |
| UAE North | 120 | 0 | 6 |  |
| UK South | 58 | 0 | 97 | 119 |
| UK West | 60 | 0 | 101 | 123 |
| West Central US | 161 | 0 | 232 | 234 |
| West Europe | 74 | 0 | 103 | 118 |
| West US | 186 | 0 | 249 | 254 |
| West US 2 | 186 | 0 | 252 | 258 |
| West US 3 | 169 | 0 | 225 | 224 |

#### [Africa](#tab/Africa/MEA)


| Source | South Africa North | South Africa West |
|---|---|---|
| Australia Central | 273 | 289 |
| Australia Central 2 | 273 | 289 |
| Australia East | 275 | 289 |
| Australia Southeast | 265 | 281 |
| Brazil South | 323 | 305 |
| Canada Central | 230 | 214 |
| Canada East | 232 | 211 |
| Central India | 137 | 153 |
| Central US | 242 | 227 |
| East Asia | 210 | 226 |
| East US | 220 | 204 |
| East US 2 | 217 | 201 |
| France Central | 158 | 143 |
| France South | 157 | 141 |
| Germany North | 172 | 156 |
| Germany West Central | 165 | 148 |
| Indonesia Central | 194 | 209 |
| Israel Central | 195 | 179 |
| Italy North | 171 | 155 |
| Japan East | 248 | 264 |
| Japan West | 238 | 255 |
| Jio India West |  |  |
| Korea Central | 240 | 256 |
| Korea South | 235 | 251 |
| Malaysia West | 184 | 201 |
| Mexico Central | 259 | 242 |
| New Zealand North | 293 | 309 |
| North Central US | 233 | 217 |
| North Europe | 173 | 157 |
| Norway East | 183 | 167 |
| Norway West | 180 | 164 |
| Poland Central | 185 | 168 |
| South Africa North |  | 20 |
| South Africa West | 21 |  |
| South Central US | 242 | 228 |
| South India | 147 | 163 |
| Southeast Asia | 181 | 196 |
| Sweden Central | 188 | 170 |
| Switzerland North | 167 | 151 |
| Switzerland West | 168 | 155 |
| UAE Central | 108 | 124 |
| UAE North | 107 | 123 |
| UK South | 163 | 147 |
| UK West | 165 | 149 |
| West Central US | 259 | 242 |
| West Europe | 171 | 157 |
| West US | 277 | 262 |
| West US 2 | 282 | 267 |
| West US 3 | 262 | 246 |


---

Additionally, you can view all of the data in a single CSV table:

```csv
Source,Australia Central,Australia Central 2,Australia East,Australia Southeast,Brazil South,Canada Central,Canada East,Central India,Central US,East Asia,East US,East US 2,France Central,France South,Germany North,Germany West Central,Israel Central,Italy North,Japan East,Japan West,Jio India West,Korea Central,Korea South,Malaysia West,Mexico Central,New Zealand North,North Central US,North Europe,Norway East,Norway West,Poland Central,Qatar Central,South Africa North,South Africa West,South Central US,South India,Southeast Asia,Sweden Central,Switzerland North,Switzerland West,UAE Central,UAE North,UK South,UK West,West Central US,West Europe,West US,West US 2,West US 3
Australia Central,,3,8,15,300,200,207,149,181,122,201,198,246,235,257,251,273,247,108,114,,129,122,103,182,32,188,259,269,267,266,0,273,289,166,130,98,275,245,242,173,171,251,255,167,254,145,167,150
Australia Central 2,3,,8,12,300,200,207,148,180,123,201,197,245,234,257,249,272,249,108,114,,128,122,102,182,33,187,259,269,266,265,0,273,289,166,129,98,274,245,241,171,170,249,252,167,253,145,166,149
Australia East,11,9,,20,298,203,214,154,182,125,203,201,261,243,275,268,273,265,105,111,,135,127,99,183,29,189,267,281,277,281,0,275,289,168,137,96,287,264,269,173,174,265,266,167,265,147,167,155
Australia Southeast,15,13,16,,309,211,218,141,189,119,209,208,258,225,270,266,263,265,115,120,,138,136,93,190,40,198,264,260,257,278,0,265,281,174,122,89,281,237,234,163,163,261,263,173,265,151,172,158
Brazil South,301,300,297,309,,133,129,307,152,318,120,120,191,191,196,198,224,204,265,272,,288,278,340,157,285,141,174,197,195,204,0,323,305,142,321,338,205,202,199,276,283,182,186,157,187,172,179,164
Canada Central,201,200,199,210,132,,14,201,29,198,19,22,90,86,100,99,125,99,157,164,,180,173,225,70,183,19,77,102,95,108,0,230,214,54,226,221,108,99,94,164,175,81,83,39,91,62,60,72
Canada East,209,208,213,221,135,15,,201,41,207,33,35,88,85,98,96,124,96,169,175,,190,185,229,79,192,32,76,99,92,106,0,232,211,64,215,230,104,95,92,169,174,80,82,54,89,74,72,82
Central India,153,152,151,144,306,202,199,,230,90,202,204,139,124,137,143,153,138,127,121,,124,114,60,265,171,222,149,157,150,151,0,137,153,245,23,59,164,123,116,37,34,140,145,240,138,223,216,237
Central US,179,180,178,188,149,29,35,226,,177,29,32,117,111,122,122,148,126,137,143,,159,156,202,45,163,15,103,123,122,129,0,242,227,26,229,198,130,125,120,193,195,108,111,19,112,42,40,45
East Asia,122,122,118,118,314,197,205,87,177,,211,206,191,170,193,196,208,188,49,49,,39,33,35,189,143,184,230,207,202,203,0,210,226,172,67,34,218,183,178,113,107,197,200,162,200,148,141,156
East US,204,201,199,213,121,23,31,205,33,212,,9,90,89,96,95,127,100,172,178,,193,188,237,56,183,24,74,95,92,102,0,220,204,41,238,235,101,101,93,180,184,80,81,56,85,73,76,61
East US 2,198,198,197,208,119,22,30,203,33,207,10,,86,91,98,93,126,104,167,173,,188,184,232,48,180,24,77,100,97,111,0,217,201,33,235,228,109,100,96,189,191,83,85,49,90,69,70,56
France Central,246,245,255,258,190,89,85,135,118,191,89,85,,14,18,12,54,21,228,228,,238,234,166,127,256,106,19,30,24,30,0,158,143,112,154,160,40,17,14,92,114,10,14,128,13,142,149,133
France South,235,234,231,225,187,86,82,118,112,171,85,90,15,,26,20,41,18,216,203,,202,196,145,131,256,101,29,38,34,36,0,157,141,120,135,142,46,14,10,80,102,20,22,128,23,147,149,141
Germany North,257,257,267,249,195,100,97,134,123,194,94,98,19,26,,11,64,21,239,227,,247,219,168,140,270,113,27,20,26,17,0,172,156,128,142,173,23,16,19,103,113,22,24,136,14,155,157,146
Germany West Central,251,248,265,267,197,99,94,141,122,195,95,92,12,19,11,,60,14,235,222,,246,238,171,140,269,111,26,23,27,23,0,165,148,125,153,167,29,9,13,98,119,17,20,134,11,149,156,146
Indonesia Central,110,110,108,100,342,231,238,70,211,47,245,240,165,153,185,172,191,177,84,79,85,78,72,21,230,132,218,188,188,185,196,0,194,209,211,50,17,205,163,163,92,91,180,184,196,172,182,175,194
Israel Central,273,272,269,263,223,124,120,150,148,209,122,126,55,41,64,61,,48,247,241,,240,234,183,169,293,138,83,79,82,63,0,195,179,152,156,179,84,51,54,118,120,58,60,161,69,183,183,171
Italy North,246,248,260,265,203,98,94,133,126,186,96,102,21,16,20,14,47,,234,234,,242,210,166,145,270,112,35,32,36,26,0,171,155,132,138,161,37,8,11,97,112,27,32,137,21,160,156,152
Japan East,108,107,103,114,264,156,165,124,136,49,171,166,228,210,239,235,246,232,,11,,30,22,76,145,128,144,228,245,241,247,0,248,264,128,105,72,251,234,235,146,146,228,233,122,232,108,100,113
Japan West,113,113,110,120,270,163,171,118,143,48,178,172,227,202,226,224,240,235,11,,,19,13,71,151,136,150,229,238,234,247,0,238,255,135,98,66,251,214,210,139,138,228,233,129,232,115,107,119
Jio India West,,,,,,,,,,,,,,,,,161,140,,,,,,77,267,186,,,,,164,,,,,,,,,,,,,,,,,,
Korea Central,129,127,127,137,285,180,188,120,159,39,193,188,239,202,247,243,240,243,31,20,,,9,69,168,151,167,237,254,234,255,0,240,256,154,100,65,260,244,243,138,138,239,241,147,241,131,124,137
Korea South,122,122,125,136,278,174,181,114,155,34,189,183,237,196,219,237,234,211,22,14,,9,,64,160,143,161,232,231,228,227,0,235,251,149,95,61,251,207,203,139,133,233,218,140,237,128,121,132
Malaysia West,103,102,99,92,339,225,230,60,203,35,237,232,166,145,167,165,183,166,77,71,77,69,64,,223,124,210,180,180,177,187,0,184,201,203,42,9,194,156,152,84,82,171,174,188,171,174,167,187
Mexico Central,183,182,179,190,156,69,76,263,45,189,53,48,128,131,140,141,169,146,145,151,,167,160,223,,167,57,118,142,139,148,0,259,242,23,246,216,146,141,138,207,210,127,130,44,132,52,70,40
New Zealand North,31,31,28,39,284,182,191,170,162,142,182,178,255,254,268,270,292,270,127,134,185,150,141,122,166,,170,245,271,267,277,0,293,309,149,149,118,275,265,261,192,190,254,258,147,258,132,137,134
North Central US,188,187,187,198,139,19,26,218,15,184,20,23,106,101,112,111,138,114,144,150,,166,160,211,56,170,,91,113,113,119,0,233,217,38,240,206,119,114,110,189,191,98,100,27,101,49,47,53
North Europe,262,259,263,264,175,78,74,148,104,232,74,77,21,30,29,28,84,38,229,231,,238,233,180,118,247,92,,29,27,36,0,173,157,105,163,176,35,33,36,109,128,13,17,118,17,135,137,128
Norway East,269,268,273,259,196,101,97,153,123,213,95,100,31,38,20,22,79,33,245,240,,254,230,180,142,274,112,28,,10,28,0,183,167,127,163,184,13,28,31,114,117,24,28,132,22,155,152,148
Norway West,268,267,265,257,195,95,91,148,124,203,93,97,26,35,27,27,83,37,241,235,,234,229,177,140,269,111,27,11,,34,0,180,164,125,151,176,18,32,35,112,124,18,22,130,22,153,154,144
Poland Central,266,265,276,278,203,108,104,147,130,203,101,109,31,35,16,23,62,27,248,247,,255,227,186,148,278,119,35,28,34,,0,185,168,134,160,183,26,27,30,111,114,30,30,146,23,164,167,152
South Africa North,274,274,269,265,321,230,226,135,243,211,220,218,159,157,171,165,195,171,248,241,,241,235,185,260,294,234,172,184,180,184,0,,20,243,148,180,189,167,164,108,107,163,165,259,166,273,280,265
South Africa West,289,289,286,282,306,214,210,151,228,227,204,201,143,142,156,149,179,156,265,257,,257,251,202,243,310,218,156,168,164,169,0,21,,228,164,196,172,152,148,125,123,148,149,243,150,257,264,247
South Central US,165,165,161,173,139,53,60,243,26,172,36,31,114,118,126,125,152,135,129,134,,152,149,204,22,151,38,104,126,123,135,0,242,228,,229,199,133,130,126,202,208,113,116,27,119,35,55,22
South India,130,129,128,121,318,224,215,21,230,68,231,233,153,134,141,152,157,141,105,99,,98,94,42,246,151,241,160,156,150,160,0,147,163,230,,38,172,143,138,49,45,149,153,215,151,202,195,213
Southeast Asia,99,98,96,90,338,226,231,60,199,40,237,234,164,150,175,169,180,166,74,69,,68,64,9,219,119,207,176,185,181,185,0,181,196,200,43,,191,163,162,81,79,169,173,187,171,172,166,185
Sweden Central,274,273,279,282,200,106,101,159,128,212,98,105,38,44,21,28,82,37,251,249,,259,252,194,145,275,118,32,12,16,24,0,188,170,132,172,189,,33,37,119,143,30,35,139,26,157,158,154
Switzerland North,245,244,262,262,201,98,93,118,125,184,99,98,17,13,16,9,51,8,235,214,,243,206,156,141,266,115,31,28,31,27,0,167,151,131,141,160,35,,7,90,92,24,29,137,17,159,158,149
Switzerland West,249,248,268,249,201,96,93,121,129,183,96,98,19,15,25,16,58,14,243,213,,247,206,152,147,263,112,42,39,43,37,0,168,155,133,148,164,45,11,,90,101,24,29,139,27,159,158,151
UAE Central,172,171,168,163,274,163,160,34,196,113,176,189,92,80,103,98,118,97,146,139,,139,139,84,207,193,189,108,115,112,112,0,108,124,208,48,79,131,90,87,,6,97,101,230,99,245,245,224
UAE North,171,171,168,163,281,175,171,32,195,108,183,190,114,102,106,120,120,113,148,138,,138,133,82,210,192,191,128,119,122,115,0,107,123,208,45,80,144,92,99,6,,119,122,234,112,248,254,226
UK South,252,249,260,263,181,81,77,134,108,201,79,82,11,20,22,17,58,28,229,229,,239,232,171,127,256,97,13,24,17,29,0,163,147,113,150,167,32,24,19,97,119,,7,123,12,140,143,135
UK West,256,253,262,266,186,84,80,142,112,198,82,86,14,23,24,21,60,34,234,234,,242,220,175,131,259,101,17,29,22,31,0,165,149,117,153,170,37,29,24,101,123,8,,128,16,143,148,137
West Central US,168,167,162,173,157,39,48,235,19,162,53,48,128,127,135,135,161,137,122,129,,145,139,188,44,148,27,115,132,130,146,0,259,242,27,215,184,139,138,131,232,234,126,128,,122,26,25,35
West Europe,260,258,270,268,191,93,89,142,117,206,87,92,19,29,18,17,74,29,238,236,,248,242,167,138,259,103,21,27,26,26,0,171,157,123,154,174,33,23,26,103,118,17,19,129,,152,147,144
West US,151,150,145,156,174,66,74,227,49,154,74,72,150,153,160,157,186,164,110,120,,138,131,174,57,133,55,138,160,158,169,0,277,262,43,203,174,164,163,158,249,254,147,150,33,153,,32,26
West US 2,171,170,165,176,180,64,72,219,45,146,79,74,153,154,161,159,186,164,103,109,,128,125,167,74,138,51,142,158,156,172,0,282,267,59,197,167,166,163,155,252,258,148,152,30,147,30,,46
West US 3,148,148,145,156,162,70,77,232,43,155,57,54,132,138,144,146,169,151,112,118,,135,132,186,38,133,52,124,147,142,151,0,262,246,21,212,181,153,148,142,225,224,133,135,34,137,18,40,
```

## Next steps

Learn about [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/).
