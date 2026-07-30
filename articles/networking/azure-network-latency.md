---
title: Azure network round-trip latency statistics
description: Learn about round-trip latency statistics between Azure regions.
services: networking
author: mbender-ms
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 07/30/2026
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

The current dataset was taken on *July 30, 2026*, and it covers the 30-day period ending on *July 30, 2026*.

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
| Australia Central | 167 | 145 | 167 | 149 |
| Australia Central 2 | 167 | 146 | 167 | 150 |
| Australia East | 162 | 140 | 161 | 146 |
| Australia Southeast | 172 | 150 | 172 | 158 |
| Austria East | 144 | 164 | 164 | 153 |
| Belgium Central | 132 | 150 | 152 | 140 |
| Brazil South | 157 | 169 | 177 | 157 |
| Canada Central | 46 | 69 | 64 | 70 |
| Canada East | 56 | 76 | 74 | 80 |
| Central India | 234 | 217 | 211 | 231 |
| Central US | 17 | 39 | 39 | 44 |
| Denmark East | 127 | 149 | 148 | 139 |
| East Asia | 162 | 148 | 141 | 156 |
| East US | 52 | 69 | 71 | 58 |
| East US 2 | 48 | 66 | 69 | 53 |
| France Central | 129 | 145 | 149 | 131 |
| France South | 127 | 146 | 148 | 139 |
| Germany North | 134 | 154 | 152 | 147 |
| Germany West Central | 135 | 151 | 154 | 142 |
| Indonesia Central | 196 | 182 | 175 | 197 |
| Israel Central | 160 | 183 | 181 | 170 |
| Italy North | 140 | 161 | 161 | 152 |
| Japan East | 121 | 107 | 100 | 112 |
| Japan West | 128 | 114 | 107 | 118 |
| Jio India West | 250 | 237 | 230 | 253 |
| Korea Central | 144 | 130 | 124 | 136 |
| Korea South | 138 | 127 | 122 | 133 |
| Malaysia West | 188 | 174 | 167 | 189 |
| Mexico Central | 44 | 52 | 72 | 39 |
| New Zealand North | 152 | 138 | 137 | 134 |
| North Central US | 30 | 51 | 51 | 57 |
| North Europe | 111 | 133 | 130 | 126 |
| Norway East | 135 | 156 | 153 | 149 |
| Norway West | 133 | 154 | 153 | 144 |
| Poland Central | 142 | 161 | 160 | 154 |
| Qatar Central | 196 | 214 | 216 | 201 |
| South Africa North | 258 | 272 | 280 | 264 |
| South Africa West | 242 | 256 | 263 | 246 |
| South Central US | 27 | 35 | 52 | 23 |
| South India | 215 | 201 | 194 | 215 |
| Southeast Asia | 183 | 170 | 162 | 183 |
| Spain Central | 120 | 134 | 142 | 126 |
| Sweden Central | 141 | 160 | 159 | 157 |
| Switzerland North | 138 | 156 | 156 | 149 |
| Switzerland West | 133 | 152 | 152 | 142 |
| UAE Central | 217 | 231 | 236 | 228 |
| UAE North | 231 | 236 | 241 | 232 |
| UK South | 120 | 140 | 139 | 131 |
| UK West | 124 | 143 | 144 | 133 |
| West Central US |  | 25 | 25 | 34 |
| West Europe | 125 | 146 | 143 | 138 |
| West US | 26 |  | 24 | 19 |
| West US 2 | 24 | 24 |  | 40 |
| West US 3 | 34 | 19 | 40 |  |

#### [Central US](#tab/CentralUS/Americas)


| Source | Central US | North Central US | South Central US |
|---|---|---|---|
| Australia Central | 179 | 192 | 166 |
| Australia Central 2 | 180 | 192 | 166 |
| Australia East | 176 | 187 | 162 |
| Australia Southeast | 186 | 198 | 174 |
| Austria East | 129 | 118 | 134 |
| Belgium Central | 118 | 108 | 118 |
| Brazil South | 149 | 137 | 139 |
| Canada Central | 29 | 19 | 54 |
| Canada East | 40 | 29 | 60 |
| Central India | 220 | 218 | 234 |
| Central US |  | 14 | 26 |
| Denmark East | 115 | 102 | 118 |
| East Asia | 176 | 188 | 173 |
| East US | 28 | 19 | 35 |
| East US 2 | 32 | 25 | 31 |
| France Central | 116 | 104 | 112 |
| France South | 109 | 100 | 119 |
| Germany North | 119 | 109 | 125 |
| Germany West Central | 119 | 110 | 122 |
| Indonesia Central | 210 | 222 | 214 |
| Israel Central | 146 | 137 | 153 |
| Italy North | 124 | 112 | 134 |
| Japan East | 135 | 147 | 129 |
| Japan West | 142 | 154 | 134 |
| Jio India West | 265 | 228 | 268 |
| Korea Central | 157 | 170 | 154 |
| Korea South | 153 | 164 | 145 |
| Malaysia West | 201 | 214 | 206 |
| Mexico Central | 45 | 58 | 22 |
| New Zealand North | 162 | 174 | 152 |
| North Central US | 14 |  | 38 |
| North Europe | 101 | 89 | 104 |
| Norway East | 121 | 111 | 127 |
| Norway West | 121 | 109 | 124 |
| Poland Central | 125 | 115 | 135 |
| Qatar Central | 178 | 168 | 183 |
| South Africa North | 243 | 234 | 244 |
| South Africa West | 227 | 217 | 228 |
| South Central US | 26 | 38 |  |
| South India | 228 | 240 | 232 |
| Southeast Asia | 197 | 210 | 200 |
| Spain Central | 104 | 96 | 104 |
| Sweden Central | 129 | 121 | 135 |
| Switzerland North | 124 | 114 | 130 |
| Switzerland West | 118 | 108 | 127 |
| UAE Central | 190 | 188 | 207 |
| UAE North | 190 | 190 | 214 |
| UK South | 108 | 97 | 112 |
| UK West | 112 | 100 | 114 |
| West Central US | 17 | 30 | 27 |
| West Europe | 108 | 100 | 118 |
| West US | 39 | 52 | 35 |
| West US 2 | 38 | 51 | 56 |
| West US 3 | 43 | 53 | 22 |

#### [East US](#tab/EastUS/Americas)


| Source | East US | East US 2 |
|---|---|---|
| Australia Central | 200 | 194 |
| Australia Central 2 | 201 | 195 |
| Australia East | 202 | 196 |
| Australia Southeast | 213 | 207 |
| Austria East | 104 | 105 |
| Belgium Central | 91 | 88 |
| Brazil South | 118 | 117 |
| Canada Central | 18 | 22 |
| Canada East | 26 | 29 |
| Central India | 201 | 204 |
| Central US | 29 | 33 |
| Denmark East | 88 | 92 |
| East Asia | 204 | 204 |
| East US |  | 8 |
| East US 2 | 9 |  |
| France Central | 87 | 83 |
| France South | 85 | 89 |
| Germany North | 94 | 97 |
| Germany West Central | 94 | 92 |
| Indonesia Central | 237 | 240 |
| Israel Central | 123 | 126 |
| Italy North | 98 | 101 |
| Japan East | 162 | 165 |
| Japan West | 168 | 167 |
| Jio India West | 212 | 215 |
| Korea Central | 185 | 188 |
| Korea South | 182 | 177 |
| Malaysia West | 229 | 232 |
| Mexico Central | 53 | 48 |
| New Zealand North | 188 | 180 |
| North Central US | 20 | 23 |
| North Europe | 73 | 76 |
| Norway East | 96 | 100 |
| Norway West | 92 | 96 |
| Poland Central | 102 | 108 |
| Qatar Central | 154 | 157 |
| South Africa North | 220 | 216 |
| South Africa West | 203 | 198 |
| South Central US | 36 | 31 |
| South India | 220 | 221 |
| Southeast Asia | 224 | 228 |
| Spain Central | 81 | 76 |
| Sweden Central | 100 | 105 |
| Switzerland North | 98 | 99 |
| Switzerland West | 91 | 95 |
| UAE Central | 172 | 179 |
| UAE North | 176 | 188 |
| UK South | 78 | 82 |
| UK West | 81 | 84 |
| West Central US | 52 | 48 |
| West Europe | 85 | 89 |
| West US | 67 | 66 |
| West US 2 | 73 | 68 |
| West US 3 | 57 | 52 |

#### [Canada](#tab/Canada/Americas)


| Source | Canada Central | Canada East |
|---|---|---|
| Australia Central | 202 | 215 |
| Australia Central 2 | 203 | 216 |
| Australia East | 202 | 214 |
| Australia Southeast | 213 | 225 |
| Austria East | 109 | 105 |
| Belgium Central | 95 | 91 |
| Brazil South | 129 | 128 |
| Canada Central |  | 13 |
| Canada East | 13 |  |
| Central India | 201 | 198 |
| Central US | 29 | 41 |
| Denmark East | 95 | 89 |
| East Asia | 200 | 210 |
| East US | 18 | 25 |
| East US 2 | 21 | 29 |
| France Central | 88 | 84 |
| France South | 86 | 82 |
| Germany North | 100 | 96 |
| Germany West Central | 97 | 93 |
| Indonesia Central | 234 | 237 |
| Israel Central | 124 | 120 |
| Italy North | 101 | 96 |
| Japan East | 160 | 169 |
| Japan West | 167 | 176 |
| Jio India West | 208 | 204 |
| Korea Central | 182 | 192 |
| Korea South | 176 | 185 |
| Malaysia West | 226 | 230 |
| Mexico Central | 70 | 76 |
| New Zealand North | 186 | 195 |
| North Central US | 18 | 28 |
| North Europe | 77 | 73 |
| Norway East | 101 | 97 |
| Norway West | 95 | 91 |
| Poland Central | 108 | 104 |
| Qatar Central | 154 | 150 |
| South Africa North | 230 | 226 |
| South Africa West | 214 | 210 |
| South Central US | 52 | 60 |
| South India | 218 | 211 |
| Southeast Asia | 222 | 231 |
| Spain Central | 91 | 87 |
| Sweden Central | 106 | 104 |
| Switzerland North | 98 | 93 |
| Switzerland West | 94 | 89 |
| UAE Central | 163 | 159 |
| UAE North | 175 | 167 |
| UK South | 81 | 77 |
| UK West | 83 | 79 |
| West Central US | 46 | 56 |
| West Europe | 90 | 86 |
| West US | 69 | 76 |
| West US 2 | 64 | 74 |
| West US 3 | 70 | 79 |

#### [South America](#tab/SouthAmerica/Americas)


| Source | Brazil South | Mexico Central |
|---|---|---|
| Australia Central | 299 | 182 |
| Australia Central 2 | 299 | 182 |
| Australia East | 295 | 178 |
| Australia Southeast | 307 | 190 |
| Austria East | 204 | 149 |
| Belgium Central | 194 | 135 |
| Brazil South |  | 156 |
| Canada Central | 129 | 71 |
| Canada East | 128 | 74 |
| Central India | 303 | 253 |
| Central US | 149 | 45 |
| Denmark East | 188 | 134 |
| East Asia | 306 | 189 |
| East US | 117 | 52 |
| East US 2 | 118 | 47 |
| France Central | 190 | 127 |
| France South | 186 | 132 |
| Germany North | 195 | 140 |
| Germany West Central | 196 | 139 |
| Indonesia Central | 344 | 230 |
| Israel Central | 224 | 168 |
| Italy North | 200 | 146 |
| Japan East | 262 | 145 |
| Japan West | 268 | 151 |
| Jio India West | 306 | 269 |
| Korea Central | 284 | 165 |
| Korea South | 277 | 160 |
| Malaysia West | 336 | 223 |
| Mexico Central | 156 |  |
| New Zealand North | 284 | 166 |
| North Central US | 139 | 57 |
| North Europe | 172 | 118 |
| Norway East | 196 | 141 |
| Norway West | 194 | 140 |
| Poland Central | 203 | 148 |
| Qatar Central | 253 | 199 |
| South Africa North | 321 | 260 |
| South Africa West | 304 | 242 |
| South Central US | 139 | 22 |
| South India | 318 | 249 |
| Southeast Asia | 330 | 217 |
| Spain Central | 183 | 120 |
| Sweden Central | 201 | 146 |
| Switzerland North | 197 | 142 |
| Switzerland West | 192 | 138 |
| UAE Central | 264 | 208 |
| UAE North | 274 | 210 |
| UK South | 180 | 126 |
| UK West | 185 | 130 |
| West Central US | 156 | 44 |
| West Europe | 185 | 131 |
| West US | 169 | 52 |
| West US 2 | 177 | 71 |
| West US 3 | 157 | 39 |

#### [Western Europe](#tab/WesternEurope/Europe)


| Source | Belgium Central | France Central | France South | Spain Central | Switzerland North | Switzerland West | West Europe |
|---|---|---|---|---|---|---|---|
| Australia Central | 250 | 246 | 235 | 249 | 245 | 242 | 254 |
| Australia Central 2 | 250 | 245 | 234 | 249 | 245 | 241 | 253 |
| Australia East | 263 | 256 | 235 | 253 | 261 | 260 | 264 |
| Australia Southeast | 240 | 256 | 224 | 255 | 246 | 232 | 263 |
| Austria East | 20 | 21 | 25 | 36 | 17 | 19 | 22 |
| Belgium Central |  | 9 | 18 | 24 | 15 | 17 | 8 |
| Brazil South | 194 | 191 | 186 | 183 | 198 | 194 | 185 |
| Canada Central | 94 | 89 | 86 | 91 | 98 | 93 | 90 |
| Canada East | 91 | 86 | 82 | 87 | 93 | 89 | 86 |
| Central India | 140 | 135 | 118 | 135 | 118 | 115 | 139 |
| Central US | 116 | 116 | 109 | 105 | 123 | 118 | 110 |
| Denmark East | 18 | 24 | 30 | 38 | 21 | 23 | 14 |
| East Asia | 186 | 194 | 170 | 185 | 182 | 178 | 203 |
| East US | 90 | 88 | 84 | 81 | 98 | 90 | 83 |
| East US 2 | 88 | 84 | 90 | 76 | 98 | 96 | 89 |
| France Central | 9 |  | 14 | 19 | 16 | 13 | 13 |
| France South | 18 | 15 |  | 18 | 13 | 10 | 22 |
| Germany North | 17 | 19 | 26 | 33 | 16 | 19 | 14 |
| Germany West Central | 10 | 12 | 19 | 26 | 9 | 12 | 11 |
| Indonesia Central | 168 | 164 | 153 | 178 | 164 | 160 | 172 |
| Israel Central | 62 | 54 | 42 | 56 | 52 | 55 | 63 |
| Italy North | 19 | 23 | 17 | 34 | 9 | 12 | 23 |
| Japan East | 232 | 231 | 221 | 224 | 235 | 231 | 234 |
| Japan West | 224 | 231 | 208 | 227 | 233 | 216 | 236 |
| Jio India West | 142 | 138 | 121 | 139 | 131 | 128 | 145 |
| Korea Central | 222 | 234 | 204 | 239 | 228 | 224 | 241 |
| Korea South | 214 | 233 | 198 | 213 | 209 | 206 | 237 |
| Malaysia West | 161 | 167 | 145 | 170 | 156 | 152 | 166 |
| Mexico Central | 134 | 128 | 132 | 120 | 142 | 138 | 132 |
| New Zealand North | 269 | 264 | 256 | 250 | 267 | 264 | 266 |
| North Central US | 106 | 106 | 100 | 95 | 113 | 107 | 101 |
| North Europe | 22 | 20 | 29 | 33 | 31 | 34 | 17 |
| Norway East | 26 | 30 | 37 | 45 | 28 | 31 | 22 |
| Norway West | 21 | 26 | 34 | 40 | 31 | 34 | 21 |
| Poland Central | 26 | 32 | 37 | 47 | 27 | 30 | 22 |
| Qatar Central | 87 | 83 | 71 | 86 | 82 | 78 | 90 |
| South Africa North | 163 | 159 | 158 | 143 | 168 | 164 | 166 |
| South Africa West | 146 | 142 | 141 | 126 | 151 | 148 | 149 |
| South Central US | 116 | 113 | 120 | 103 | 130 | 127 | 117 |
| South India | 134 | 147 | 128 | 142 | 136 | 138 | 152 |
| Southeast Asia | 166 | 162 | 142 | 164 | 160 | 157 | 169 |
| Spain Central | 24 | 20 | 18 |  | 28 | 24 | 28 |
| Sweden Central | 33 | 36 | 43 | 50 | 31 | 34 | 27 |
| Switzerland North | 15 | 17 | 13 | 28 |  | 7 | 17 |
| Switzerland West | 17 | 14 | 10 | 24 | 7 |  | 20 |
| UAE Central | 96 | 92 | 80 | 95 | 90 | 86 | 99 |
| UAE North | 97 | 114 | 93 | 97 | 92 | 91 | 111 |
| UK South | 14 | 11 | 20 | 25 | 23 | 19 | 11 |
| UK West | 17 | 14 | 23 | 27 | 29 | 24 | 14 |
| West Central US | 132 | 129 | 126 | 120 | 138 | 132 | 124 |
| West Europe | 8 | 12 | 22 | 27 | 17 | 20 |  |
| West US | 147 | 146 | 145 | 134 | 156 | 152 | 145 |
| West US 2 | 152 | 149 | 148 | 141 | 155 | 150 | 142 |
| West US 3 | 136 | 130 | 139 | 123 | 146 | 140 | 137 |

#### [Central Europe](#tab/CentralEurope/Europe)


| Source | Austria East | Germany North | Germany West Central | Italy North | Poland Central |
|---|---|---|---|---|---|
| Australia Central | 258 | 257 | 251 | 248 | 268 |
| Australia Central 2 | 258 | 257 | 250 | 249 | 268 |
| Australia East | 268 | 271 | 267 | 262 | 278 |
| Australia Southeast | 248 | 267 | 255 | 251 | 277 |
| Austria East |  | 18 | 14 | 16 | 16 |
| Belgium Central | 20 | 18 | 11 | 20 | 26 |
| Brazil South | 205 | 195 | 198 | 201 | 203 |
| Canada Central | 109 | 100 | 97 | 100 | 108 |
| Canada East | 106 | 96 | 94 | 96 | 104 |
| Central India | 133 | 135 | 140 | 134 | 147 |
| Central US | 127 | 118 | 119 | 123 | 125 |
| Denmark East | 25 | 12 | 15 | 25 | 20 |
| East Asia | 194 | 194 | 193 | 186 | 204 |
| East US | 103 | 92 | 94 | 97 | 100 |
| East US 2 | 107 | 98 | 94 | 101 | 108 |
| France Central | 21 | 18 | 12 | 21 | 30 |
| France South | 26 | 26 | 20 | 17 | 37 |
| Germany North | 19 |  | 12 | 21 | 16 |
| Germany West Central | 14 | 11 |  | 14 | 23 |
| Indonesia Central | 176 | 186 | 171 | 178 | 198 |
| Israel Central | 48 | 60 | 57 | 49 | 58 |
| Italy North | 15 | 20 | 14 |  | 26 |
| Japan East | 244 | 240 | 236 | 237 | 250 |
| Japan West | 233 | 242 | 236 | 238 | 252 |
| Jio India West | 142 | 144 | 142 | 138 | 156 |
| Korea Central | 240 | 245 | 235 | 234 | 252 |
| Korea South | 223 | 222 | 216 | 214 | 232 |
| Malaysia West | 169 | 168 | 162 | 170 | 189 |
| Mexico Central | 150 | 140 | 140 | 147 | 148 |
| New Zealand North | 280 | 276 | 275 | 273 | 285 |
| North Central US | 117 | 110 | 110 | 113 | 117 |
| North Europe | 36 | 27 | 27 | 36 | 35 |
| Norway East | 33 | 20 | 23 | 33 | 28 |
| Norway West | 37 | 25 | 27 | 36 | 33 |
| Poland Central | 17 | 16 | 23 | 27 |  |
| Qatar Central | 95 | 94 | 88 | 85 | 105 |
| South Africa North | 176 | 172 | 166 | 173 | 185 |
| South Africa West | 160 | 155 | 149 | 156 | 168 |
| South Central US | 132 | 125 | 124 | 133 | 135 |
| South India | 149 | 148 | 150 | 140 | 158 |
| Southeast Asia | 173 | 173 | 166 | 165 | 184 |
| Spain Central | 37 | 33 | 27 | 33 | 47 |
| Sweden Central | 36 | 24 | 27 | 38 | 26 |
| Switzerland North | 17 | 16 | 10 | 9 | 27 |
| Switzerland West | 20 | 19 | 13 | 12 | 29 |
| UAE Central | 103 | 103 | 97 | 95 | 114 |
| UAE North | 106 | 106 | 100 | 107 | 116 |
| UK South | 28 | 21 | 17 | 27 | 29 |
| UK West | 34 | 22 | 21 | 33 | 31 |
| West Central US | 144 | 134 | 136 | 140 | 141 |
| West Europe | 23 | 14 | 11 | 22 | 23 |
| West US | 164 | 154 | 152 | 159 | 161 |
| West US 2 | 163 | 151 | 155 | 158 | 160 |
| West US 3 | 151 | 146 | 142 | 150 | 155 |

#### [Nordic Countries](#tab/Nordic/Europe)


| Source | Denmark East | Norway East | Norway West | Sweden Central |
|---|---|---|---|---|
| Australia Central | 263 | 269 | 267 | 274 |
| Australia Central 2 | 262 | 268 | 266 | 274 |
| Australia East | 271 | 279 | 264 | 286 |
| Australia Southeast | 263 | 260 | 256 | 283 |
| Austria East | 26 | 32 | 35 | 36 |
| Belgium Central | 20 | 27 | 21 | 33 |
| Brazil South | 189 | 196 | 194 | 201 |
| Canada Central | 95 | 101 | 94 | 109 |
| Canada East | 91 | 98 | 91 | 105 |
| Central India | 138 | 154 | 148 | 164 |
| Central US | 114 | 120 | 117 | 126 |
| Denmark East |  | 12 | 17 | 20 |
| East Asia | 199 | 208 | 202 | 220 |
| East US | 89 | 95 | 91 | 100 |
| East US 2 | 94 | 100 | 96 | 106 |
| France Central | 23 | 30 | 24 | 37 |
| France South | 32 | 38 | 34 | 44 |
| Germany North | 13 | 20 | 25 | 25 |
| Germany West Central | 16 | 22 | 26 | 28 |
| Indonesia Central | 185 | 188 | 184 | 204 |
| Israel Central | 67 | 74 | 78 | 79 |
| Italy North | 29 | 33 | 37 | 37 |
| Japan East | 240 | 248 | 247 | 253 |
| Japan West | 242 | 248 | 240 | 255 |
| Jio India West | 147 | 159 | 153 | 167 |
| Korea Central | 250 | 256 | 236 | 260 |
| Korea South | 227 | 233 | 230 | 252 |
| Malaysia West | 183 | 180 | 177 | 196 |
| Mexico Central | 135 | 142 | 140 | 147 |
| New Zealand North | 272 | 278 | 272 | 285 |
| North Central US | 103 | 113 | 109 | 119 |
| North Europe | 21 | 28 | 26 | 35 |
| Norway East | 14 |  | 10 | 12 |
| Norway West | 19 | 10 |  | 17 |
| Poland Central | 21 | 28 | 33 | 25 |
| Qatar Central | 100 | 106 | 103 | 111 |
| South Africa North | 179 | 185 | 180 | 188 |
| South Africa West | 161 | 167 | 163 | 172 |
| South Central US | 120 | 128 | 124 | 137 |
| South India | 147 | 160 | 157 | 171 |
| Southeast Asia | 178 | 185 | 173 | 191 |
| Spain Central | 39 | 45 | 40 | 51 |
| Sweden Central | 21 | 12 | 16 |  |
| Switzerland North | 21 | 28 | 31 | 32 |
| Switzerland West | 25 | 31 | 33 | 36 |
| UAE Central | 108 | 115 | 112 | 120 |
| UAE North | 110 | 117 | 117 | 122 |
| UK South | 22 | 24 | 17 | 31 |
| UK West | 24 | 29 | 22 | 36 |
| West Central US | 129 | 135 | 131 | 140 |
| West Europe | 15 | 22 | 21 | 26 |
| West US | 150 | 156 | 153 | 162 |
| West US 2 | 146 | 152 | 150 | 158 |
| West US 3 | 141 | 148 | 141 | 158 |

#### [UK / Northern Europe](#tab/NorthernEurope/Europe)


| Source | North Europe | UK South | UK West |
|---|---|---|---|
| Australia Central | 260 | 251 | 256 |
| Australia Central 2 | 260 | 249 | 254 |
| Australia East | 263 | 261 | 263 |
| Australia Southeast | 264 | 261 | 262 |
| Austria East | 36 | 28 | 32 |
| Belgium Central | 21 | 14 | 18 |
| Brazil South | 172 | 181 | 185 |
| Canada Central | 76 | 81 | 83 |
| Canada East | 73 | 77 | 79 |
| Central India | 146 | 141 | 141 |
| Central US | 101 | 109 | 112 |
| Denmark East | 20 | 21 | 22 |
| East Asia | 212 | 200 | 196 |
| East US | 71 | 78 | 80 |
| East US 2 | 77 | 82 | 83 |
| France Central | 19 | 10 | 13 |
| France South | 29 | 20 | 23 |
| Germany North | 27 | 21 | 22 |
| Germany West Central | 26 | 16 | 20 |
| Indonesia Central | 190 | 182 | 186 |
| Israel Central | 78 | 59 | 60 |
| Italy North | 37 | 28 | 32 |
| Japan East | 227 | 230 | 235 |
| Japan West | 232 | 232 | 237 |
| Jio India West | 158 | 148 | 146 |
| Korea Central | 239 | 239 | 243 |
| Korea South | 234 | 234 | 221 |
| Malaysia West | 181 | 173 | 177 |
| Mexico Central | 118 | 126 | 130 |
| New Zealand North | 253 | 266 | 269 |
| North Central US | 90 | 97 | 100 |
| North Europe |  | 13 | 16 |
| Norway East | 28 | 24 | 28 |
| Norway West | 26 | 17 | 22 |
| Poland Central | 35 | 29 | 30 |
| Qatar Central | 97 | 88 | 93 |
| South Africa North | 172 | 163 | 166 |
| South Africa West | 155 | 147 | 149 |
| South Central US | 104 | 113 | 115 |
| South India | 159 | 150 | 153 |
| Southeast Asia | 176 | 167 | 172 |
| Spain Central | 33 | 25 | 27 |
| Sweden Central | 33 | 31 | 36 |
| Switzerland North | 31 | 23 | 28 |
| Switzerland West | 31 | 19 | 24 |
| UAE Central | 106 | 97 | 102 |
| UAE North | 121 | 112 | 119 |
| UK South | 12 |  | 7 |
| UK West | 16 | 8 |  |
| West Central US | 111 | 120 | 124 |
| West Europe | 17 | 11 | 14 |
| West US | 133 | 140 | 143 |
| West US 2 | 129 | 139 | 144 |
| West US 3 | 125 | 132 | 132 |

#### [Australia / New Zealand](#tab/Australasia/APAC)


| Source | Australia Central | Australia Central 2 | Australia East | Australia Southeast | New Zealand North |
|---|---|---|---|---|---|
| Australia Central |  | 3 | 8 | 13 | 32 |
| Australia Central 2 | 4 |  | 9 | 13 | 32 |
| Australia East | 8 | 8 |  | 15 | 28 |
| Australia Southeast | 13 | 12 | 15 |  | 40 |
| Austria East | 258 | 256 | 261 | 247 | 282 |
| Belgium Central | 250 | 249 | 261 | 241 | 271 |
| Brazil South | 299 | 299 | 295 | 307 | 284 |
| Canada Central | 202 | 202 | 202 | 212 | 186 |
| Canada East | 215 | 216 | 214 | 225 | 197 |
| Central India | 147 | 148 | 145 | 138 | 170 |
| Central US | 180 | 180 | 176 | 186 | 163 |
| Denmark East | 262 | 260 | 264 | 251 | 268 |
| East Asia | 123 | 123 | 122 | 120 | 143 |
| East US | 200 | 200 | 201 | 212 | 183 |
| East US 2 | 194 | 195 | 196 | 207 | 178 |
| France Central | 246 | 244 | 255 | 254 | 260 |
| France South | 235 | 234 | 234 | 224 | 256 |
| Germany North | 257 | 257 | 270 | 269 | 274 |
| Germany West Central | 251 | 249 | 266 | 254 | 273 |
| Indonesia Central | 110 | 109 | 108 | 100 | 132 |
| Israel Central | 273 | 272 | 269 | 264 | 294 |
| Italy North | 248 | 248 | 260 | 248 | 272 |
| Japan East | 107 | 107 | 103 | 114 | 128 |
| Japan West | 113 | 113 | 109 | 120 | 134 |
| Jio India West | 167 | 166 | 163 | 158 | 187 |
| Korea Central | 128 | 127 | 126 | 137 | 150 |
| Korea South | 122 | 122 | 124 | 135 | 142 |
| Malaysia West | 102 | 102 | 100 | 92 | 124 |
| Mexico Central | 182 | 182 | 178 | 190 | 166 |
| New Zealand North | 32 | 32 | 28 | 40 |  |
| North Central US | 190 | 189 | 186 | 197 | 173 |
| North Europe | 261 | 260 | 263 | 264 | 253 |
| Norway East | 269 | 268 | 279 | 260 | 276 |
| Norway West | 267 | 266 | 267 | 256 | 273 |
| Poland Central | 268 | 268 | 278 | 273 | 285 |
| Qatar Central | 185 | 185 | 182 | 177 | 206 |
| South Africa North | 271 | 270 | 328 | 321 | 291 |
| South Africa West | 288 | 287 | 328 | 320 | 308 |
| South Central US | 166 | 166 | 162 | 173 | 150 |
| South India | 130 | 130 | 128 | 121 | 151 |
| Southeast Asia | 98 | 97 | 95 | 88 | 119 |
| Spain Central | 249 | 248 | 255 | 252 | 255 |
| Sweden Central | 275 | 274 | 285 | 277 | 285 |
| Switzerland North | 245 | 244 | 255 | 245 | 267 |
| Switzerland West | 241 | 240 | 251 | 232 | 264 |
| UAE Central | 176 | 177 | 173 | 166 | 197 |
| UAE North | 176 | 176 | 173 | 167 | 197 |
| UK South | 251 | 249 | 261 | 261 | 266 |
| UK West | 256 | 254 | 264 | 262 | 269 |
| West Central US | 168 | 167 | 162 | 172 | 153 |
| West Europe | 253 | 251 | 265 | 262 | 263 |
| West US | 145 | 146 | 140 | 150 | 139 |
| West US 2 | 166 | 166 | 160 | 172 | 137 |
| West US 3 | 149 | 149 | 146 | 157 | 134 |

#### [Japan](#tab/Japan/APAC)


| Source | Japan East | Japan West |
|---|---|---|
| Australia Central | 108 | 113 |
| Australia Central 2 | 108 | 113 |
| Australia East | 104 | 110 |
| Australia Southeast | 114 | 120 |
| Austria East | 245 | 232 |
| Belgium Central | 234 | 224 |
| Brazil South | 262 | 268 |
| Canada Central | 160 | 167 |
| Canada East | 170 | 176 |
| Central India | 122 | 123 |
| Central US | 136 | 142 |
| Denmark East | 244 | 236 |
| East Asia | 49 | 48 |
| East US | 162 | 168 |
| East US 2 | 161 | 167 |
| France Central | 229 | 231 |
| France South | 223 | 209 |
| Germany North | 240 | 243 |
| Germany West Central | 235 | 236 |
| Indonesia Central | 85 | 85 |
| Israel Central | 246 | 247 |
| Italy North | 238 | 238 |
| Japan East |  | 11 |
| Japan West | 12 |  |
| Jio India West | 142 | 142 |
| Korea Central | 30 | 19 |
| Korea South | 22 | 14 |
| Malaysia West | 77 | 77 |
| Mexico Central | 145 | 151 |
| New Zealand North | 128 | 134 |
| North Central US | 148 | 154 |
| North Europe | 225 | 233 |
| Norway East | 247 | 248 |
| Norway West | 248 | 241 |
| Poland Central | 249 | 252 |
| Qatar Central | 162 | 161 |
| South Africa North | 247 | 246 |
| South Africa West | 264 | 264 |
| South Central US | 129 | 135 |
| South India | 106 | 106 |
| Southeast Asia | 72 | 72 |
| Spain Central | 226 | 227 |
| Sweden Central | 252 | 254 |
| Switzerland North | 235 | 222 |
| Switzerland West | 232 | 216 |
| UAE Central | 151 | 151 |
| UAE North | 151 | 151 |
| UK South | 229 | 232 |
| UK West | 233 | 237 |
| West Central US | 122 | 128 |
| West Europe | 233 | 236 |
| West US | 108 | 114 |
| West US 2 | 101 | 107 |
| West US 3 | 112 | 118 |

#### [Korea](#tab/Korea/APAC)


| Source | Korea Central | Korea South |
|---|---|---|
| Australia Central | 130 | 122 |
| Australia Central 2 | 129 | 122 |
| Australia East | 127 | 124 |
| Australia Southeast | 138 | 135 |
| Austria East | 229 | 222 |
| Belgium Central | 222 | 214 |
| Brazil South | 283 | 276 |
| Canada Central | 182 | 176 |
| Canada East | 193 | 185 |
| Central India | 121 | 114 |
| Central US | 158 | 154 |
| Denmark East | 233 | 226 |
| East Asia | 39 | 33 |
| East US | 184 | 179 |
| East US 2 | 188 | 176 |
| France Central | 239 | 232 |
| France South | 205 | 199 |
| Germany North | 249 | 222 |
| Germany West Central | 244 | 216 |
| Indonesia Central | 80 | 74 |
| Israel Central | 242 | 237 |
| Italy North | 234 | 214 |
| Japan East | 29 | 21 |
| Japan West | 19 | 13 |
| Jio India West | 137 | 132 |
| Korea Central |  | 8 |
| Korea South | 9 |  |
| Malaysia West | 69 | 63 |
| Mexico Central | 166 | 159 |
| New Zealand North | 150 | 142 |
| North Central US | 169 | 163 |
| North Europe | 239 | 234 |
| Norway East | 256 | 233 |
| Norway West | 237 | 230 |
| Poland Central | 258 | 232 |
| Qatar Central | 157 | 151 |
| South Africa North | 242 | 236 |
| South Africa West | 260 | 253 |
| South Central US | 154 | 149 |
| South India | 100 | 94 |
| Southeast Asia | 68 | 65 |
| Spain Central | 234 | 213 |
| Sweden Central | 260 | 241 |
| Switzerland North | 228 | 209 |
| Switzerland West | 225 | 205 |
| UAE Central | 147 | 144 |
| UAE North | 147 | 142 |
| UK South | 240 | 233 |
| UK West | 244 | 221 |
| West Central US | 144 | 138 |
| West Europe | 243 | 237 |
| West US | 131 | 127 |
| West US 2 | 124 | 121 |
| West US 3 | 136 | 132 |

#### [India](#tab/India/APAC)


| Source | Central India | Jio India West | South India |
|---|---|---|---|
| Australia Central | 147 | 167 | 130 |
| Australia Central 2 | 148 | 167 | 130 |
| Australia East | 144 | 163 | 128 |
| Australia Southeast | 138 | 158 | 121 |
| Austria East | 132 | 143 | 147 |
| Belgium Central | 135 | 142 | 140 |
| Brazil South | 304 | 306 | 322 |
| Canada Central | 201 | 206 | 221 |
| Canada East | 198 | 204 | 214 |
| Central India |  | 28 | 20 |
| Central US | 223 | 266 | 228 |
| Denmark East | 136 | 147 | 151 |
| East Asia | 88 | 104 | 70 |
| East US | 198 | 212 | 216 |
| East US 2 | 204 | 218 | 226 |
| France Central | 134 | 138 | 148 |
| France South | 118 | 120 | 133 |
| Germany North | 136 | 143 | 150 |
| Germany West Central | 139 | 141 | 154 |
| Indonesia Central | 68 | 86 | 50 |
| Israel Central | 151 | 159 | 159 |
| Italy North | 132 | 136 | 139 |
| Japan East | 122 | 142 | 105 |
| Japan West | 122 | 142 | 106 |
| Jio India West | 29 |  | 41 |
| Korea Central | 119 | 137 | 100 |
| Korea South | 114 | 133 | 96 |
| Malaysia West | 59 | 78 | 41 |
| Mexico Central | 251 | 268 | 249 |
| New Zealand North | 171 | 188 | 152 |
| North Central US | 215 | 226 | 239 |
| North Europe | 147 | 158 | 162 |
| Norway East | 154 | 160 | 163 |
| Norway West | 145 | 153 | 157 |
| Poland Central | 152 | 154 | 159 |
| Qatar Central | 42 | 66 | 60 |
| South Africa North | 130 | 145 | 147 |
| South Africa West | 147 | 162 | 164 |
| South Central US | 232 | 267 | 232 |
| South India | 19 | 41 |  |
| Southeast Asia | 53 | 73 | 37 |
| Spain Central | 132 | 140 | 140 |
| Sweden Central | 157 | 166 | 170 |
| Switzerland North | 118 | 131 | 136 |
| Switzerland West | 115 | 128 | 138 |
| UAE Central | 34 | 48 | 52 |
| UAE North | 32 | 47 | 50 |
| UK South | 141 | 149 | 152 |
| UK West | 140 | 144 | 156 |
| West Central US | 234 | 242 | 215 |
| West Europe | 140 | 148 | 153 |
| West US | 218 | 238 | 201 |
| West US 2 | 210 | 230 | 194 |
| West US 3 | 231 | 253 | 214 |

#### [Asia](#tab/Asia/APAC)


| Source | East Asia | Indonesia Central | Malaysia West | Southeast Asia |
|---|---|---|---|---|
| Australia Central | 122 | 110 | 102 | 98 |
| Australia Central 2 | 124 | 109 | 102 | 98 |
| Australia East | 121 | 107 | 99 | 95 |
| Australia Southeast | 121 | 100 | 92 | 88 |
| Austria East | 194 | 175 | 167 | 174 |
| Belgium Central | 187 | 168 | 161 | 167 |
| Brazil South | 307 | 344 | 336 | 331 |
| Canada Central | 201 | 234 | 226 | 222 |
| Canada East | 210 | 238 | 231 | 231 |
| Central India | 87 | 67 | 58 | 53 |
| Central US | 176 | 209 | 202 | 198 |
| Denmark East | 197 | 180 | 172 | 168 |
| East Asia |  | 47 | 35 | 36 |
| East US | 202 | 236 | 228 | 224 |
| East US 2 | 204 | 240 | 232 | 228 |
| France Central | 193 | 164 | 165 | 162 |
| France South | 171 | 153 | 145 | 145 |
| Germany North | 194 | 186 | 169 | 174 |
| Germany West Central | 192 | 169 | 162 | 166 |
| Indonesia Central | 47 |  | 21 | 17 |
| Israel Central | 209 | 192 | 183 | 179 |
| Italy North | 186 | 177 | 169 | 167 |
| Japan East | 49 | 84 | 76 | 72 |
| Japan West | 47 | 85 | 76 | 72 |
| Jio India West | 103 | 86 | 78 | 73 |
| Korea Central | 39 | 80 | 68 | 68 |
| Korea South | 33 | 74 | 63 | 65 |
| Malaysia West | 35 | 21 |  | 9 |
| Mexico Central | 189 | 230 | 222 | 218 |
| New Zealand North | 143 | 131 | 124 | 119 |
| North Central US | 188 | 222 | 213 | 209 |
| North Europe | 215 | 190 | 181 | 176 |
| Norway East | 209 | 188 | 180 | 185 |
| Norway West | 202 | 184 | 177 | 173 |
| Poland Central | 205 | 197 | 188 | 184 |
| Qatar Central | 123 | 105 | 96 | 92 |
| South Africa North | 210 | 190 | 182 | 177 |
| South Africa West | 226 | 207 | 199 | 196 |
| South Central US | 173 | 214 | 206 | 202 |
| South India | 68 | 49 | 41 | 37 |
| Southeast Asia | 36 | 16 | 8 |  |
| Spain Central | 186 | 179 | 170 | 166 |
| Sweden Central | 219 | 202 | 195 | 190 |
| Switzerland North | 183 | 164 | 155 | 162 |
| Switzerland West | 178 | 160 | 152 | 159 |
| UAE Central | 115 | 95 | 87 | 82 |
| UAE North | 113 | 96 | 87 | 83 |
| UK South | 200 | 180 | 171 | 167 |
| UK West | 198 | 185 | 177 | 172 |
| West Central US | 162 | 196 | 188 | 184 |
| West Europe | 201 | 171 | 169 | 169 |
| West US | 148 | 182 | 174 | 170 |
| West US 2 | 141 | 174 | 166 | 162 |
| West US 3 | 156 | 196 | 187 | 183 |

#### [Middle East](#tab/MiddleEast/MEA)


| Source | Israel Central | Qatar Central | UAE Central | UAE North |
|---|---|---|---|---|
| Australia Central | 273 | 181 | 172 | 172 |
| Australia Central 2 | 272 | 181 | 172 | 171 |
| Australia East | 269 | 179 | 170 | 172 |
| Australia Southeast | 262 | 172 | 163 | 165 |
| Austria East | 46 | 94 | 102 | 104 |
| Belgium Central | 62 | 87 | 95 | 97 |
| Brazil South | 223 | 253 | 273 | 277 |
| Canada Central | 124 | 154 | 163 | 175 |
| Canada East | 121 | 151 | 160 | 171 |
| Central India | 150 | 43 | 33 | 32 |
| Central US | 145 | 177 | 194 | 192 |
| Denmark East | 68 | 98 | 106 | 108 |
| East Asia | 209 | 122 | 114 | 113 |
| East US | 121 | 154 | 171 | 174 |
| East US 2 | 125 | 158 | 188 | 190 |
| France Central | 53 | 83 | 100 | 113 |
| France South | 41 | 72 | 81 | 94 |
| Germany North | 59 | 94 | 104 | 115 |
| Germany West Central | 55 | 88 | 97 | 118 |
| Indonesia Central | 191 | 106 | 95 | 96 |
| Israel Central |  | 109 | 119 | 121 |
| Italy North | 49 | 85 | 95 | 106 |
| Japan East | 246 | 162 | 150 | 152 |
| Japan West | 247 | 157 | 149 | 149 |
| Jio India West | 159 | 67 | 48 | 47 |
| Korea Central | 242 | 157 | 147 | 146 |
| Korea South | 237 | 147 | 138 | 143 |
| Malaysia West | 183 | 97 | 87 | 87 |
| Mexico Central | 169 | 199 | 207 | 210 |
| New Zealand North | 293 | 206 | 197 | 197 |
| North Central US | 138 | 168 | 187 | 189 |
| North Europe | 77 | 98 | 114 | 128 |
| Norway East | 73 | 106 | 115 | 118 |
| Norway West | 77 | 103 | 112 | 119 |
| Poland Central | 57 | 105 | 113 | 119 |
| Qatar Central | 109 |  | 13 | 14 |
| South Africa North | 196 | 113 | 104 | 103 |
| South Africa West | 179 | 129 | 121 | 119 |
| South Central US | 154 | 183 | 206 | 214 |
| South India | 162 | 60 | 52 | 50 |
| Southeast Asia | 179 | 92 | 81 | 83 |
| Spain Central | 56 | 86 | 94 | 96 |
| Sweden Central | 77 | 111 | 118 | 122 |
| Switzerland North | 51 | 82 | 90 | 92 |
| Switzerland West | 53 | 78 | 86 | 90 |
| UAE Central | 118 | 13 |  | 6 |
| UAE North | 119 | 15 | 6 |  |
| UK South | 60 | 88 | 101 | 119 |
| UK West | 61 | 94 | 110 | 123 |
| West Central US | 161 | 195 | 216 | 229 |
| West Europe | 63 | 90 | 98 | 111 |
| West US | 183 | 213 | 231 | 234 |
| West US 2 | 181 | 214 | 234 | 240 |
| West US 3 | 171 | 200 | 239 | 243 |

#### [Africa](#tab/Africa/MEA)


| Source | South Africa North | South Africa West |
|---|---|---|
| Australia Central | 271 | 287 |
| Australia Central 2 | 270 | 287 |
| Australia East | 328 | 328 |
| Australia Southeast | 321 | 320 |
| Austria East | 174 | 159 |
| Belgium Central | 162 | 145 |
| Brazil South | 321 | 304 |
| Canada Central | 230 | 213 |
| Canada East | 227 | 210 |
| Central India | 131 | 146 |
| Central US | 244 | 228 |
| Denmark East | 178 | 159 |
| East Asia | 211 | 227 |
| East US | 219 | 202 |
| East US 2 | 216 | 198 |
| France Central | 159 | 142 |
| France South | 158 | 141 |
| Germany North | 172 | 155 |
| Germany West Central | 165 | 148 |
| Indonesia Central | 196 | 212 |
| Israel Central | 195 | 179 |
| Italy North | 174 | 157 |
| Japan East | 251 | 268 |
| Japan West | 246 | 262 |
| Jio India West | 147 | 163 |
| Korea Central | 246 | 262 |
| Korea South | 236 | 253 |
| Malaysia West | 187 | 203 |
| Mexico Central | 259 | 241 |
| New Zealand North | 296 | 312 |
| North Central US | 233 | 216 |
| North Europe | 172 | 155 |
| Norway East | 185 | 167 |
| Norway West | 179 | 162 |
| Poland Central | 186 | 168 |
| Qatar Central | 113 | 129 |
| South Africa North |  | 20 |
| South Africa West | 21 |  |
| South Central US | 244 | 228 |
| South India | 150 | 166 |
| Southeast Asia | 177 | 194 |
| Spain Central | 142 | 126 |
| Sweden Central | 186 | 170 |
| Switzerland North | 168 | 151 |
| Switzerland West | 164 | 148 |
| UAE Central | 105 | 121 |
| UAE North | 103 | 119 |
| UK South | 164 | 146 |
| UK West | 167 | 149 |
| West Central US | 258 | 242 |
| West Europe | 166 | 149 |
| West US | 273 | 256 |
| West US 2 | 279 | 262 |
| West US 3 | 263 | 245 |


---

Additionally, you can view all of the data in a single CSV table:

```csv
Source,Australia Central,Australia Central 2,Australia East,Australia Southeast,Austria East,Belgium Central,Brazil South,Canada Central,Canada East,Central India,Central US,Denmark East,East Asia,East US,East US 2,France Central,France South,Germany North,Germany West Central,Indonesia Central,Israel Central,Italy North,Japan East,Japan West,Jio India West,Korea Central,Korea South,Malaysia West,Mexico Central,New Zealand North,North Central US,North Europe,Norway East,Norway West,Poland Central,Qatar Central,South Africa North,South Africa West,South Central US,South India,Southeast Asia,Spain Central,Sweden Central,Switzerland North,Switzerland West,UAE Central,UAE North,UK South,UK West,West Central US,West Europe,West US,West US 2,West US 3
Australia Central,,3,8,13,258,250,299,202,215,147,179,263,122,200,194,246,235,257,251,110,273,248,108,113,167,130,122,102,182,32,192,260,269,267,268,181,271,287,166,130,98,249,274,245,242,172,172,251,256,167,254,145,167,149
Australia Central 2,4,,9,13,258,250,299,203,216,148,180,262,124,201,195,245,234,257,250,109,272,249,108,113,167,129,122,102,182,32,192,260,268,266,268,181,270,287,166,130,98,249,274,245,241,172,171,249,254,167,253,146,167,150
Australia East,8,8,,15,268,263,295,202,214,144,176,271,121,202,196,256,235,271,267,107,269,262,104,110,163,127,124,99,178,28,187,263,279,264,278,179,328,328,162,128,95,253,286,261,260,170,172,261,263,162,264,140,161,146
Australia Southeast,13,12,15,,248,240,307,213,225,138,186,263,121,213,207,256,224,267,255,100,262,251,114,120,158,138,135,92,190,40,198,264,260,256,277,172,321,320,174,121,88,255,283,246,232,163,165,261,262,172,263,150,172,158
Austria East,258,256,261,247,,20,204,109,105,132,129,26,194,104,105,21,25,18,14,175,46,16,245,232,143,229,222,167,149,282,118,36,32,35,16,94,174,159,134,147,174,36,36,17,19,102,104,28,32,144,22,164,164,153
Belgium Central,250,249,261,241,20,,194,95,91,135,118,20,187,91,88,9,18,18,11,168,62,20,234,224,142,222,214,161,135,271,108,21,27,21,26,87,162,145,118,140,167,24,33,15,17,95,97,14,18,132,8,150,152,140
Brazil South,299,299,295,307,205,194,,129,128,304,149,189,307,118,117,191,186,195,198,344,223,201,262,268,306,283,276,336,156,284,137,172,196,194,203,253,321,304,139,322,331,183,201,198,194,273,277,181,185,157,185,169,177,157
Canada Central,202,202,202,212,109,94,129,,13,201,29,95,201,18,22,89,86,100,97,234,124,100,160,167,206,182,176,226,71,186,19,76,101,94,108,154,230,213,54,221,222,91,109,98,93,163,175,81,83,46,90,69,64,70
Canada East,215,216,214,225,106,91,128,13,,198,40,91,210,26,29,86,82,96,94,238,121,96,170,176,204,193,185,231,74,197,29,73,98,91,104,151,227,210,60,214,231,87,105,93,89,160,171,77,79,56,86,76,74,80
Central India,147,148,145,138,133,140,303,201,198,,220,138,87,201,204,135,118,135,140,67,150,134,122,123,28,121,114,58,253,170,218,146,154,148,147,43,131,146,234,20,53,135,164,118,115,33,32,141,141,234,139,217,211,231
Central US,180,180,176,186,127,116,149,29,41,223,,114,176,29,33,116,109,118,119,209,145,123,136,142,266,158,154,202,45,163,14,101,120,117,125,177,244,228,26,228,198,105,126,123,118,194,192,109,112,17,110,39,39,44
Denmark East,262,260,264,251,25,18,188,95,89,136,115,,197,88,92,24,30,12,15,180,68,25,244,236,147,233,226,172,134,268,102,20,12,17,20,98,178,159,118,151,168,38,20,21,23,106,108,21,22,127,14,149,148,139
East Asia,123,123,122,120,194,186,306,200,210,88,176,199,,204,204,194,170,194,193,47,209,186,49,48,104,39,33,35,189,143,188,212,208,202,204,122,211,227,173,70,36,185,220,182,178,114,113,200,196,162,203,148,141,156
East US,200,200,201,212,103,90,117,18,25,198,28,89,202,,8,88,84,92,94,236,121,97,162,168,212,184,179,228,52,183,19,71,95,91,100,154,219,202,35,216,224,81,100,98,90,171,174,78,80,52,83,69,71,58
East US 2,194,195,196,207,107,88,118,21,29,204,32,94,204,9,,84,90,98,94,240,125,101,161,167,218,188,176,232,47,178,25,77,100,96,108,158,216,198,31,226,228,76,106,98,96,188,190,82,83,48,89,66,69,53
France Central,246,244,255,254,21,9,190,88,84,134,116,23,193,87,83,,14,18,12,164,53,21,229,231,138,239,232,165,127,260,104,19,30,24,30,83,159,142,112,148,162,19,37,16,13,100,113,10,13,129,13,145,149,131
France South,235,234,234,224,26,18,186,86,82,118,109,32,171,85,89,15,,26,20,153,41,17,223,209,120,205,199,145,132,256,100,29,38,34,37,72,158,141,119,133,145,18,44,13,10,81,94,20,23,127,22,146,148,139
Germany North,257,257,270,269,19,17,195,100,96,136,119,13,194,94,97,19,26,,12,186,59,21,240,243,143,249,222,169,140,274,109,27,20,25,16,94,172,155,125,150,174,33,25,16,19,104,115,21,22,134,14,154,152,147
Germany West Central,251,249,266,254,14,10,196,97,93,139,119,16,192,94,92,12,19,11,,169,55,14,235,236,141,244,216,162,139,273,110,26,22,26,23,88,165,148,122,154,166,26,28,9,12,97,118,16,20,135,11,151,154,142
Indonesia Central,110,109,108,100,176,168,344,234,237,68,210,185,47,237,240,164,153,186,171,,191,178,85,85,86,80,74,21,230,132,222,190,188,184,198,106,196,212,214,50,17,178,204,164,160,95,96,182,186,196,172,182,175,197
Israel Central,273,272,269,264,48,62,224,124,120,151,146,67,209,123,126,54,42,60,57,192,,49,246,247,159,242,237,183,168,294,137,78,74,78,58,109,195,179,153,159,179,56,79,52,55,119,121,59,60,160,63,183,181,170
Italy North,248,248,260,248,15,19,200,101,96,132,124,29,186,98,101,23,17,20,14,177,49,,238,238,136,234,214,169,146,272,112,37,33,37,26,85,174,157,134,139,167,34,37,9,12,95,106,28,32,140,23,161,161,152
Japan East,107,107,103,114,244,232,262,160,169,122,135,240,49,162,165,231,221,240,236,84,246,237,,11,142,29,21,76,145,128,147,227,248,247,250,162,251,268,129,105,72,224,253,235,231,150,152,230,235,121,234,107,100,112
Japan West,113,113,109,120,233,224,268,167,176,122,142,242,47,168,167,231,208,242,236,85,247,238,12,,142,19,13,76,151,134,154,232,248,240,252,157,246,262,134,106,72,227,255,233,216,149,149,232,237,128,236,114,107,118
Jio India West,167,166,163,158,142,142,306,208,204,29,265,147,103,212,215,138,121,144,142,86,159,138,142,142,,137,132,78,269,187,228,158,159,153,156,67,147,163,268,41,73,139,167,131,128,48,47,148,146,250,145,237,230,253
Korea Central,128,127,126,137,240,222,284,182,192,119,157,250,39,185,188,234,204,245,235,80,242,234,30,19,137,,8,68,165,150,170,239,256,236,252,157,246,262,154,100,68,239,260,228,224,147,146,239,243,144,241,130,124,136
Korea South,122,122,124,135,223,214,277,176,185,114,153,227,33,182,177,233,198,222,216,74,237,214,22,14,133,9,,63,160,142,164,234,233,230,232,147,236,253,145,96,65,213,252,209,206,138,143,234,221,138,237,127,122,133
Malaysia West,102,102,100,92,169,161,336,226,230,59,201,183,35,229,232,167,145,168,162,21,183,170,77,77,78,69,63,,223,124,214,181,180,177,189,97,187,203,206,41,9,170,196,156,152,87,87,173,177,188,166,174,167,189
Mexico Central,182,182,178,190,150,134,156,70,76,251,45,135,189,53,48,128,132,140,140,230,169,147,145,151,268,166,159,222,,166,58,118,142,140,148,199,259,241,22,249,218,120,147,142,138,207,210,126,130,44,132,52,72,39
New Zealand North,32,32,28,40,280,269,284,186,195,171,162,272,143,188,180,264,256,276,275,131,293,273,128,134,188,150,142,124,166,,174,253,278,272,285,206,296,312,152,152,119,250,285,267,264,197,197,266,269,152,266,138,137,134
North Central US,190,189,186,197,117,106,139,18,28,215,14,103,188,20,23,106,100,110,110,222,138,113,148,154,226,169,163,213,57,173,,90,113,109,117,168,233,216,38,239,209,95,119,113,107,187,189,97,100,30,101,51,51,57
North Europe,261,260,263,264,36,22,172,77,73,147,101,21,215,73,76,20,29,27,27,190,77,36,225,233,158,239,234,181,118,253,89,,28,26,35,98,172,155,104,162,176,33,35,31,34,114,128,13,16,111,17,133,130,126
Norway East,269,268,279,260,33,26,196,101,97,154,121,14,209,96,100,30,37,20,23,188,73,33,247,248,160,256,233,180,141,276,111,28,,10,28,106,185,167,127,163,185,45,12,28,31,115,118,24,28,135,22,156,153,149
Norway West,267,266,267,256,37,21,194,95,91,145,121,19,202,92,96,26,34,25,27,184,77,36,248,241,153,237,230,177,140,273,109,26,10,,33,103,179,162,124,157,173,40,17,31,34,112,119,17,22,133,21,154,153,144
Poland Central,268,268,278,273,17,26,203,108,104,152,125,21,205,102,108,32,37,16,23,197,57,27,249,252,154,258,232,188,148,285,115,35,28,33,,105,186,168,135,159,184,47,25,27,30,113,119,29,30,142,22,161,160,154
Qatar Central,185,185,182,177,95,87,253,154,150,42,178,100,123,154,157,83,71,94,88,105,109,85,162,161,66,157,151,96,199,206,168,97,106,103,105,,113,129,183,60,92,86,111,82,78,13,14,88,93,196,90,214,216,201
South Africa North,271,270,328,321,176,163,321,230,226,130,243,179,210,220,216,159,158,172,166,190,196,173,247,246,145,242,236,182,260,291,234,172,185,180,185,113,,20,244,147,177,143,188,168,164,104,103,163,166,258,166,272,280,264
South Africa West,288,287,328,320,160,146,304,214,210,147,227,161,226,203,198,142,141,155,149,207,179,156,264,264,162,260,253,199,242,308,217,155,167,163,168,129,21,,228,164,196,126,172,151,148,121,119,147,149,242,149,256,263,246
South Central US,166,166,162,173,132,116,139,52,60,232,26,120,173,36,31,113,120,125,124,214,154,133,129,135,267,154,149,206,22,150,38,104,128,124,135,183,244,228,,232,202,103,137,130,127,206,214,113,115,27,117,35,52,23
South India,130,130,128,121,149,134,318,218,211,19,228,147,68,220,221,147,128,148,150,49,162,140,106,106,41,100,94,41,249,151,240,159,160,157,158,60,150,166,232,,37,142,171,136,138,52,50,150,153,215,152,201,194,215
Southeast Asia,98,97,95,88,173,166,330,222,231,53,197,178,36,224,228,162,142,173,166,16,179,165,72,72,73,68,65,8,217,119,210,176,185,173,184,92,177,194,200,37,,164,191,160,157,81,83,167,172,183,169,170,162,183
Spain Central,249,248,255,252,37,24,183,91,87,132,104,39,186,81,76,20,18,33,27,179,56,33,226,227,140,234,213,170,120,255,96,33,45,40,47,86,142,126,104,140,166,,51,28,24,94,96,25,27,120,28,134,142,126
Sweden Central,275,274,285,277,36,33,201,106,104,157,129,21,219,100,105,36,43,24,27,202,77,38,252,254,166,260,241,195,146,285,121,33,12,16,26,111,186,170,135,170,190,50,,31,34,118,122,31,36,141,27,160,159,157
Switzerland North,245,244,255,245,17,15,197,98,93,118,124,21,183,98,99,17,13,16,10,164,51,9,235,222,131,228,209,155,142,267,114,31,28,31,27,82,168,151,130,136,162,28,32,,7,90,92,23,28,138,17,156,156,149
Switzerland West,241,240,251,232,20,17,192,94,89,115,118,25,178,91,95,14,10,19,13,160,53,12,232,216,128,225,205,152,138,264,108,31,31,33,29,78,164,148,127,138,159,24,36,7,,86,90,19,24,133,20,152,152,142
UAE Central,176,177,173,166,103,96,264,163,159,34,190,108,115,172,179,92,80,103,97,95,118,95,151,151,48,147,144,87,208,197,188,106,115,112,114,13,105,121,207,52,82,95,120,90,86,,6,97,102,217,99,231,236,228
UAE North,176,176,173,167,106,97,274,175,167,32,190,110,113,176,188,114,93,106,100,96,119,107,151,151,47,147,142,87,210,197,190,121,117,117,116,15,103,119,214,50,83,97,122,92,91,6,,112,119,231,111,236,241,232
UK South,251,249,261,261,28,14,180,81,77,141,108,22,200,78,82,11,20,21,17,180,60,27,229,232,149,240,233,171,126,266,97,12,24,17,29,88,164,146,112,152,167,25,31,23,19,101,119,,7,120,11,140,139,131
UK West,256,254,264,262,34,17,185,83,79,140,112,24,198,81,84,14,23,22,21,185,61,33,233,237,144,244,221,177,130,269,100,16,29,22,31,94,167,149,114,156,172,27,36,29,24,110,123,8,,124,14,143,144,133
West Central US,168,167,162,172,144,132,156,46,56,234,17,129,162,52,48,129,126,134,136,196,161,140,122,128,242,144,138,188,44,153,30,111,135,131,141,195,258,242,27,215,184,120,140,138,132,216,229,120,124,,124,25,25,34
West Europe,253,251,265,262,23,8,185,90,86,140,108,15,201,85,89,12,22,14,11,171,63,22,233,236,148,243,237,169,131,263,100,17,22,21,23,90,166,149,118,153,169,27,26,17,20,98,111,11,14,125,,146,143,138
West US,145,146,140,150,164,147,169,69,76,218,39,150,148,67,66,146,145,154,152,182,183,159,108,114,238,131,127,174,52,139,52,133,156,153,161,213,273,256,35,201,170,134,162,156,152,231,234,140,143,26,145,,24,19
West US 2,166,166,160,172,163,152,177,64,74,210,38,146,141,73,68,149,148,151,155,174,181,158,101,107,230,124,121,166,71,137,51,129,152,150,160,214,279,262,56,194,162,141,158,155,150,234,240,139,144,24,142,24,,40
West US 3,149,149,146,157,151,136,157,70,79,231,43,141,156,57,52,130,139,146,142,196,171,150,112,118,253,136,132,187,39,134,53,125,148,141,155,200,263,245,22,214,183,123,158,146,140,239,243,132,132,34,137,19,40,
```

## Next steps

Learn about [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/).