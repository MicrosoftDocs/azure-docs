---
title: Azure network round-trip latency statistics
description: Use Azure network latency statistics to select regions, plan multi-region deployments, and design disaster recovery solutions with optimal performance considerations.
services: networking
author: mbender-ms
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 06/30/2025
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

The current dataset was taken on *June 30, 2025*, and it covers the 30-day period ending on *June 29, 2025*. The following **new regions** were included in the dataset:

- New Zealand North
- Indonesia Central
- Malaysia West

For readability, each table is split into tabs for groups of Azure regions. The tabs are organized by regions, and then by source region in the first column of each table. For example, the *East US* tab also shows the latency from all source regions to the two *East US* regions: *East US* and *East US 2*. 

> [!IMPORTANT]
> Monthly latency numbers across Azure regions don't change regularly. You can expect an update of these tables every 6 to 9 months. Not all global Azure regions are listed in the following tables. When new regions come online, we update this document as soon as latency data is available.
> 
> You can perform VM-to-VM latency between regions using [test Virtual Machines](../virtual-network/virtual-network-test-latency.md) in your Azure subscription.

#### [North America / South America](#tab/Americas)

Latency tables for Americas regions including US, Canada, and South America.

Use the following tabs to view latency statistics for each region.

#### [Europe](#tab/Europe)

Latency tables for European regions.

Use the following tabs to view latency statistics for each region.

#### [Asia-Pacific](#tab/APAC)

Latency tables for Asia-Pacific regions including Australia, New Zealand, Japan, Malaysia, Korea, and Southeast Asia.

Use the following tabs to view latency statistics for each region.

#### [Middle East / Africa](#tab/MEA)

Latency tables for Middle East and Africa regions including UAE, South Africa, Israel, and Qatar.

Use the following tabs to view latency statistics for each region.

---

#### [West US](#tab/WestUS/Americas)


| Source | West Central US | West US | West US 2 | West US 3 |
|---|---|---|---|---|
| Australia Central | 166 | 147 | 166 | 151 |
| Australia Central 2 | 166 | 147 | 166 | 150 |
| Australia East | 161 | 141 | 162 | 146 |
| Australia Southeast | 173 | 151 | 173 | 159 |
| Brazil South | 157 | 178 | 178 | 166 |
| Canada Central | 39 | 64 | 59 | 70 |
| Canada East | 48 | 71 | 68 | 76 |
| Central India | 247 | 230 | 221 | 242 |
| Central US | 18 | 41 | 39 | 48 |
| East Asia | 173 | 159 | 152 | 163 |
| East US | 50 | 70 | 66 | 61 |
| East US 2 | 48 | 69 | 69 | 56 |
| France Central | 131 | 153 | 152 | 137 |
| France South | 132 | 154 | 150 | 141 |
| Germany North | 139 | 162 | 160 | 149 |
| Germany West Central | 136 | 158 | 158 | 142 |
| Indonesia Central |  |  |  |  |
| Israel Central | 183 | 205 | 205 | 206 |
| Italy North | 138 | 161 | 159 | 150 |
| Japan East | 121 | 107 | 100 | 112 |
| Japan West | 128 | 115 | 107 | 120 |
| Korea Central | 144 | 130 | 123 | 136 |
| Korea South | 137 | 124 | 117 | 129 |
| Malaysia West | 189 | 175 | 167 | 191 |
| Mexico Central | 43 | 52 | 69 | 40 |
| New Zealand North | 147 | 133 | 137 | 135 |
| North Central US | 27 | 51 | 47 | 58 |
| North Europe | 116 | 140 | 137 | 130 |
| Norway East | 141 | 163 | 161 | 152 |
| Norway West | 138 | 160 | 159 | 149 |
| Poland Central | 148 | 170 | 168 | 158 |
| Qatar Central | 269 | 263 | 259 | 267 |
| South Africa North | 256 | 277 | 278 | 265 |
| South Africa West | 241 | 263 | 262 | 249 |
| South Central US | 25 | 36 | 47 | 24 |
| South India | 217 | 204 | 196 | 219 |
| Southeast Asia | 184 | 171 | 163 | 187 |
| Sweden Central | 160 | 182 | 183 | 175 |
| Switzerland North | 141 | 164 | 162 | 150 |
| Switzerland West | 136 | 159 | 156 | 147 |
| UAE Central | 230 | 252 | 245 | 241 |
| UAE North | 231 | 253 | 249 | 241 |
| UK South | 125 | 147 | 145 | 137 |
| UK West | 127 | 150 | 149 | 136 |
| West Central US |  | 26 | 25 | 36 |
| West Europe | 131 | 154 | 151 | 143 |
| West India | 197 | 184 | 176 | 199 |
| West US | 26 |  | 25 | 20 |
| West US 2 | 25 | 25 |  | 41 |
| West US 3 | 36 | 20 | 42 |  |

#### [Central US](#tab/CentralUS/Americas)


| Source | Central US | North Central US | South Central US |
|---|---|---|---|
| Australia Central | 179 | 188 | 167 |
| Australia Central 2 | 179 | 188 | 167 |
| Australia East | 176 | 185 | 164 |
| Australia Southeast | 188 | 198 | 176 |
| Brazil South | 151 | 138 | 142 |
| Canada Central | 27 | 18 | 49 |
| Canada East | 37 | 26 | 59 |
| Central India | 245 | 245 | 253 |
| Central US |  | 15 | 29 |
| East Asia | 187 | 197 | 181 |
| East US | 29 | 19 | 38 |
| East US 2 | 36 | 26 | 32 |
| France Central | 120 | 106 | 114 |
| France South | 115 | 103 | 120 |
| Germany North | 126 | 111 | 126 |
| Germany West Central | 124 | 110 | 119 |
| Indonesia Central |  |  |  |
| Israel Central | 169 | 157 | 171 |
| Italy North | 124 | 110 | 129 |
| Japan East | 136 | 145 | 129 |
| Japan West | 143 | 152 | 137 |
| Korea Central | 159 | 168 | 155 |
| Korea South | 153 | 161 | 146 |
| Malaysia West | 203 | 212 | 208 |
| Mexico Central | 47 | 58 | 23 |
| New Zealand North | 162 | 172 | 151 |
| North Central US | 15 |  | 41 |
| North Europe | 102 | 90 | 103 |
| Norway East | 126 | 113 | 127 |
| Norway West | 125 | 112 | 131 |
| Poland Central | 132 | 121 | 134 |
| Qatar Central | 248 | 235 | 260 |
| South Africa North | 250 | 238 | 240 |
| South Africa West | 232 | 221 | 224 |
| South Central US | 28 | 40 |  |
| South India | 232 | 222 | 236 |
| Southeast Asia | 200 | 208 | 203 |
| Sweden Central | 146 | 133 | 146 |
| Switzerland North | 126 | 115 | 128 |
| Switzerland West | 122 | 109 | 127 |
| UAE Central | 215 | 200 | 219 |
| UAE North | 215 | 201 | 219 |
| UK South | 111 | 96 | 112 |
| UK West | 112 | 99 | 118 |
| West Central US | 19 | 28 | 27 |
| West Europe | 117 | 105 | 120 |
| West India | 212 | 221 | 216 |
| West US | 42 | 52 | 37 |
| West US 2 | 40 | 48 | 52 |
| West US 3 | 49 | 61 | 27 |

#### [East US](#tab/EastUS/Americas)


| Source | East US | East US 2 |
|---|---|---|
| Australia Central | 202 | 199 |
| Australia Central 2 | 203 | 200 |
| Australia East | 201 | 196 |
| Australia Southeast | 214 | 210 |
| Brazil South | 119 | 118 |
| Canada Central | 21 | 24 |
| Canada East | 34 | 38 |
| Central India | 241 | 239 |
| Central US | 29 | 38 |
| East Asia | 215 | 217 |
| East US |  | 10 |
| East US 2 | 10 |  |
| France Central | 88 | 85 |
| France South | 85 | 89 |
| Germany North | 98 | 99 |
| Germany West Central | 94 | 91 |
| Indonesia Central |  |  |
| Israel Central | 138 | 136 |
| Italy North | 93 | 99 |
| Japan East | 165 | 164 |
| Japan West | 172 | 171 |
| Korea Central | 191 | 193 |
| Korea South | 179 | 179 |
| Malaysia West | 229 | 239 |
| Mexico Central | 53 | 49 |
| New Zealand North | 190 | 185 |
| North Central US | 20 | 27 |
| North Europe | 74 | 78 |
| Norway East | 101 | 104 |
| Norway West | 93 | 103 |
| Poland Central | 104 | 108 |
| Qatar Central | 199 | 199 |
| South Africa North | 219 | 215 |
| South Africa West | 203 | 200 |
| South Central US | 37 | 33 |
| South India | 205 | 214 |
| Southeast Asia | 223 | 234 |
| Sweden Central | 116 | 114 |
| Switzerland North | 97 | 100 |
| Switzerland West | 92 | 96 |
| UAE Central | 184 | 193 |
| UAE North | 185 | 191 |
| UK South | 79 | 84 |
| UK West | 81 | 85 |
| West Central US | 54 | 50 |
| West Europe | 86 | 93 |
| West India | 237 | 245 |
| West US | 74 | 71 |
| West US 2 | 70 | 71 |
| West US 3 | 61 | 57 |

#### [Canada](#tab/Canada/Americas)


| Source | Canada Central | Canada East |
|---|---|---|
| Australia Central | 204 | 211 |
| Australia Central 2 | 204 | 210 |
| Australia East | 201 | 208 |
| Australia Southeast | 214 | 222 |
| Brazil South | 131 | 134 |
| Canada Central |  | 14 |
| Canada East | 15 |  |
| Central India | 251 | 258 |
| Central US | 27 | 36 |
| East Asia | 211 | 219 |
| East US | 20 | 32 |
| East US 2 | 23 | 36 |
| France Central | 101 | 103 |
| France South | 97 | 100 |
| Germany North | 107 | 110 |
| Germany West Central | 106 | 109 |
| Indonesia Central |  |  |
| Israel Central | 156 | 159 |
| Italy North | 106 | 109 |
| Japan East | 159 | 167 |
| Japan West | 166 | 174 |
| Korea Central | 182 | 190 |
| Korea South | 175 | 183 |
| Malaysia West | 227 | 234 |
| Mexico Central | 71 | 79 |
| New Zealand North | 187 | 194 |
| North Central US | 18 | 26 |
| North Europe | 86 | 87 |
| Norway East | 111 | 111 |
| Norway West | 105 | 109 |
| Poland Central | 115 | 118 |
| Qatar Central | 215 | 227 |
| South Africa North | 232 | 240 |
| South Africa West | 218 | 224 |
| South Central US | 51 | 58 |
| South India | 216 | 221 |
| Southeast Asia | 222 | 230 |
| Sweden Central | 128 | 129 |
| Switzerland North | 109 | 111 |
| Switzerland West | 103 | 106 |
| UAE Central | 195 | 198 |
| UAE North | 197 | 200 |
| UK South | 92 | 95 |
| UK West | 93 | 96 |
| West Central US | 40 | 47 |
| West Europe | 99 | 102 |
| West India | 235 | 243 |
| West US | 65 | 71 |
| West US 2 | 60 | 68 |
| West US 3 | 73 | 79 |

#### [South America](#tab/SouthAmerica/Americas)


| Source | Brazil South | Mexico Central |
|---|---|---|
| Australia Central | 308 | 184 |
| Australia Central 2 | 309 | 184 |
| Australia East | 305 | 180 |
| Australia Southeast | 317 | 192 |
| Brazil South |  | 157 |
| Canada Central | 130 | 71 |
| Canada East | 135 | 81 |
| Central India | 340 | 263 |
| Central US | 150 | 47 |
| East Asia | 323 | 199 |
| East US | 117 | 53 |
| East US 2 | 116 | 49 |
| France Central | 190 | 129 |
| France South | 186 | 132 |
| Germany North | 195 | 144 |
| Germany West Central | 196 | 137 |
| Indonesia Central |  | 284 |
| Israel Central | 236 | 185 |
| Italy North | 194 | 140 |
| Japan East | 271 | 147 |
| Japan West | 278 | 155 |
| Korea Central | 293 | 169 |
| Korea South | 287 | 163 |
| Malaysia West | 339 | 226 |
| Mexico Central | 156 |  |
| New Zealand North | 292 | 168 |
| North Central US | 138 | 59 |
| North Europe | 172 | 118 |
| Norway East | 196 | 143 |
| Norway West | 193 | 148 |
| Poland Central | 203 | 150 |
| Qatar Central | 306 | 253 |
| South Africa North | 319 | 258 |
| South Africa West | 303 | 242 |
| South Central US | 139 | 23 |
| South India | 304 | 253 |
| Southeast Asia | 335 | 221 |
| Sweden Central | 217 | 162 |
| Switzerland North | 196 | 143 |
| Switzerland West | 195 | 139 |
| UAE Central | 283 | 229 |
| UAE North | 285 | 231 |
| UK South | 180 | 131 |
| UK West | 184 | 135 |
| West Central US | 157 | 44 |
| West Europe | 188 | 136 |
| West India | 348 | 234 |
| West US | 178 | 53 |
| West US 2 | 177 | 71 |
| West US 3 | 167 | 41 |

#### [Western Europe](#tab/WesternEurope/Europe)


| Source | France Central | France South | Switzerland North | Switzerland West | West Europe |
|---|---|---|---|---|---|
| Australia Central | 244 | 234 | 245 | 241 | 254 |
| Australia Central 2 | 245 | 234 | 245 | 241 | 254 |
| Australia East | 241 | 230 | 242 | 237 | 250 |
| Australia Southeast | 236 | 225 | 236 | 231 | 244 |
| Brazil South | 190 | 186 | 196 | 195 | 187 |
| Canada Central | 100 | 96 | 107 | 102 | 97 |
| Canada East | 104 | 100 | 111 | 106 | 101 |
| Central India | 136 | 122 | 133 | 128 | 150 |
| Central US | 120 | 116 | 126 | 120 | 115 |
| East Asia | 182 | 170 | 182 | 177 | 190 |
| East US | 87 | 83 | 94 | 89 | 84 |
| East US 2 | 84 | 87 | 98 | 94 | 89 |
| France Central |  | 15 | 17 | 13 | 13 |
| France South | 15 |  | 14 | 10 | 23 |
| Germany North | 19 | 27 | 16 | 19 | 15 |
| Germany West Central | 12 | 19 | 9 | 12 | 12 |
| Indonesia Central |  |  |  |  |  |
| Israel Central | 52 | 41 | 51 | 53 | 66 |
| Italy North | 21 | 12 | 9 | 10 | 23 |
| Japan East | 214 | 202 | 213 | 209 | 235 |
| Japan West | 216 | 205 | 216 | 211 | 224 |
| Korea Central | 213 | 201 | 212 | 208 | 220 |
| Korea South | 207 | 195 | 207 | 202 | 215 |
| Malaysia West | 154 | 143 | 156 | 150 | 165 |
| Mexico Central | 128 | 131 | 142 | 138 | 135 |
| New Zealand North | 264 | 260 | 271 | 267 | 272 |
| North Central US | 105 | 101 | 113 | 107 | 102 |
| North Europe | 20 | 29 | 31 | 35 | 18 |
| Norway East | 30 | 38 | 28 | 31 | 23 |
| Norway West | 27 | 36 | 31 | 35 | 19 |
| Poland Central | 29 | 37 | 27 | 30 | 23 |
| Qatar Central | 122 | 113 | 127 | 120 | 130 |
| South Africa North | 160 | 153 | 164 | 160 | 164 |
| South Africa West | 144 | 138 | 148 | 144 | 148 |
| South Central US | 113 | 118 | 130 | 124 | 116 |
| South India | 131 | 123 | 132 | 126 | 141 |
| Southeast Asia | 148 | 138 | 152 | 147 | 161 |
| Sweden Central | 42 | 49 | 42 | 45 | 35 |
| Switzerland North | 17 | 14 |  | 7 | 18 |
| Switzerland West | 14 | 10 | 7 |  | 21 |
| UAE Central | 113 | 101 | 112 | 108 | 121 |
| UAE North | 114 | 103 | 114 | 109 | 122 |
| UK South | 11 | 20 | 23 | 19 | 12 |
| UK West | 15 | 25 | 29 | 24 | 15 |
| West Central US | 131 | 131 | 140 | 136 | 129 |
| West Europe | 16 | 25 | 20 | 23 |  |
| West India | 166 | 153 | 165 | 160 | 173 |
| West US | 153 | 154 | 164 | 159 | 153 |
| West US 2 | 152 | 148 | 160 | 156 | 150 |
| West US 3 | 137 | 142 | 150 | 147 | 143 |

#### [Central Europe](#tab/CentralEurope/Europe)


| Source | Germany North | Germany West Central | Italy North | Poland Central |
|---|---|---|---|---|
| Australia Central | 258 | 251 | 243 | 266 |
| Australia Central 2 | 257 | 251 | 243 | 266 |
| Australia East | 254 | 247 | 240 | 263 |
| Australia Southeast | 248 | 241 | 234 | 257 |
| Brazil South | 194 | 196 | 194 | 202 |
| Canada Central | 106 | 106 | 106 | 115 |
| Canada East | 110 | 110 | 110 | 118 |
| Central India | 145 | 141 | 131 | 162 |
| Central US | 124 | 124 | 123 | 133 |
| East Asia | 193 | 187 | 179 | 202 |
| East US | 93 | 93 | 92 | 101 |
| East US 2 | 96 | 90 | 98 | 105 |
| France Central | 18 | 12 | 21 | 29 |
| France South | 26 | 20 | 12 | 37 |
| Germany North |  | 12 | 21 | 17 |
| Germany West Central | 10 |  | 14 | 22 |
| Indonesia Central |  |  | 142 | 180 |
| Israel Central | 62 | 56 | 48 | 71 |
| Italy North | 20 | 14 |  | 31 |
| Japan East | 239 | 219 | 211 | 248 |
| Japan West | 228 | 221 | 214 | 237 |
| Korea Central | 224 | 218 | 210 | 233 |
| Korea South | 219 | 212 | 205 | 228 |
| Malaysia West | 168 | 161 | 153 |  |
| Mexico Central | 142 | 136 | 139 | 150 |
| New Zealand North | 276 | 274 | 269 |  |
| North Central US | 111 | 111 | 110 | 119 |
| North Europe | 27 | 26 | 36 | 35 |
| Norway East | 20 | 22 | 33 | 29 |
| Norway West | 26 | 26 | 36 | 34 |
| Poland Central | 16 | 22 | 32 |  |
| Qatar Central | 134 | 129 | 120 | 145 |
| South Africa North | 169 | 165 | 166 | 178 |
| South Africa West | 153 | 148 | 150 | 162 |
| South Central US | 124 | 118 | 128 | 134 |
| South India | 142 | 135 | 128 | 152 |
| Southeast Asia | 164 | 157 | 148 | 173 |
| Sweden Central | 34 | 36 | 50 | 31 |
| Switzerland North | 16 | 9 | 9 | 26 |
| Switzerland West | 19 | 13 | 11 | 30 |
| UAE Central | 124 | 118 | 110 | 133 |
| UAE North | 126 | 119 | 111 | 135 |
| UK South | 21 | 17 | 28 | 29 |
| UK West | 23 | 22 | 32 | 31 |
| West Central US | 139 | 137 | 138 | 147 |
| West Europe | 15 | 13 | 24 | 24 |
| West India | 177 | 170 | 162 |  |
| West US | 162 | 158 | 161 | 170 |
| West US 2 | 159 | 158 | 159 | 168 |
| West US 3 | 150 | 144 | 151 | 160 |

#### [Nordic Countries](#tab/Nordic/Europe)


| Source | Norway East | Norway West | Sweden Central |
|---|---|---|---|
| Australia Central | 270 | 267 | 296 |
| Australia Central 2 | 270 | 267 | 294 |
| Australia East | 266 | 263 | 299 |
| Australia Southeast | 260 | 257 | 278 |
| Brazil South | 197 | 193 | 218 |
| Canada Central | 108 | 105 | 128 |
| Canada East | 112 | 109 | 130 |
| Central India | 163 | 160 | 209 |
| Central US | 126 | 124 | 144 |
| East Asia | 206 | 203 | 222 |
| East US | 97 | 91 | 115 |
| East US 2 | 100 | 100 | 117 |
| France Central | 30 | 27 | 41 |
| France South | 39 | 36 | 48 |
| Germany North | 20 | 26 | 34 |
| Germany West Central | 22 | 25 | 35 |
| Indonesia Central |  |  |  |
| Israel Central | 84 | 84 | 94 |
| Italy North | 33 | 35 | 49 |
| Japan East | 248 | 235 | 276 |
| Japan West | 240 | 237 | 261 |
| Korea Central | 236 | 234 | 263 |
| Korea South | 231 | 228 | 262 |
| Malaysia West | 181 | 177 |  |
| Mexico Central | 141 | 147 | 160 |
| New Zealand North | 283 | 286 |  |
| North Central US | 111 | 111 | 130 |
| North Europe | 28 | 26 | 40 |
| Norway East |  | 10 | 16 |
| Norway West | 10 |  | 19 |
| Poland Central | 29 | 34 | 29 |
| Qatar Central | 151 | 162 | 171 |
| South Africa North | 182 | 177 | 196 |
| South Africa West | 166 | 161 | 179 |
| South Central US | 124 | 130 | 147 |
| South India | 154 | 152 | 188 |
| Southeast Asia | 176 | 173 | 199 |
| Sweden Central | 16 | 21 |  |
| Switzerland North | 28 | 31 | 43 |
| Switzerland West | 31 | 34 | 46 |
| UAE Central | 136 | 134 | 149 |
| UAE North | 138 | 135 | 153 |
| UK South | 23 | 17 | 38 |
| UK West | 28 | 22 | 41 |
| West Central US | 141 | 138 | 159 |
| West Europe | 24 | 20 | 35 |
| West India | 189 | 186 |  |
| West US | 163 | 160 | 182 |
| West US 2 | 161 | 158 | 181 |
| West US 3 | 152 | 149 | 177 |

#### [UK / Northern Europe](#tab/NorthernEurope/Europe)


| Source | North Europe | UK South | UK West |
|---|---|---|---|
| Australia Central | 260 | 251 | 256 |
| Australia Central 2 | 260 | 251 | 256 |
| Australia East | 256 | 247 | 253 |
| Australia Southeast | 250 | 241 | 247 |
| Brazil South | 172 | 180 | 184 |
| Canada Central | 86 | 91 | 92 |
| Canada East | 88 | 96 | 97 |
| Central India | 138 | 137 | 158 |
| Central US | 101 | 110 | 112 |
| East Asia | 196 | 187 | 192 |
| East US | 71 | 78 | 80 |
| East US 2 | 77 | 82 | 84 |
| France Central | 19 | 11 | 15 |
| France South | 29 | 20 | 25 |
| Germany North | 27 | 22 | 23 |
| Germany West Central | 26 | 17 | 22 |
| Indonesia Central |  |  |  |
| Israel Central | 78 | 65 | 211 |
| Italy North | 36 | 28 | 32 |
| Japan East | 232 | 230 | 232 |
| Japan West | 239 | 221 | 227 |
| Korea Central | 227 | 218 | 223 |
| Korea South | 221 | 212 | 218 |
| Malaysia West | 170 | 159 | 165 |
| Mexico Central | 117 | 131 | 135 |
| New Zealand North | 253 | 266 | 270 |
| North Central US | 89 | 96 | 100 |
| North Europe |  | 13 | 17 |
| Norway East | 28 | 24 | 28 |
| Norway West | 26 | 17 | 22 |
| Poland Central | 35 | 29 | 31 |
| Qatar Central | 136 | 129 | 148 |
| South Africa North | 175 | 161 | 168 |
| South Africa West | 159 | 145 | 156 |
| South Central US | 101 | 111 | 117 |
| South India | 146 | 136 | 138 |
| Southeast Asia | 166 | 155 | 161 |
| Sweden Central | 34 | 39 | 42 |
| Switzerland North | 31 | 23 | 28 |
| Switzerland West | 35 | 19 | 24 |
| UAE Central | 127 | 118 | 123 |
| UAE North | 128 | 119 | 125 |
| UK South | 13 |  | 7 |
| UK West | 16 | 7 |  |
| West Central US | 118 | 125 | 127 |
| West Europe | 19 | 14 | 15 |
| West India | 179 | 171 | 176 |
| West US | 140 | 147 | 150 |
| West US 2 | 138 | 145 | 149 |
| West US 3 | 130 | 137 | 139 |

#### [Australasia](#tab/Australasia/APAC)


| Source | Australia Central | Australia Central 2 | Australia East | Australia Southeast | New Zealand North |
|---|---|---|---|---|---|
| Australia Central |  | 3 | 8 | 16 | 32 |
| Australia Central 2 | 4 |  | 8 | 13 | 31 |
| Australia East | 8 | 8 |  | 16 | 28 |
| Australia Southeast | 16 | 12 | 16 |  | 41 |
| Brazil South | 308 | 308 | 305 | 317 | 293 |
| Canada Central | 203 | 203 | 201 | 212 | 187 |
| Canada East | 212 | 210 | 211 | 222 | 196 |
| Central India | 152 | 151 | 155 | 155 | 195 |
| Central US | 177 | 178 | 175 | 187 | 161 |
| East Asia | 122 | 122 | 119 | 119 | 144 |
| East US | 200 | 200 | 201 | 213 | 188 |
| East US 2 | 196 | 196 | 196 | 208 | 187 |
| France Central | 244 | 244 | 240 | 236 | 264 |
| France South | 234 | 233 | 230 | 225 | 260 |
| Germany North | 258 | 258 | 254 | 248 | 277 |
| Germany West Central | 250 | 250 | 247 | 241 | 275 |
| Indonesia Central |  |  |  |  | 214 |
| Israel Central | 299 | 303 | 289 | 291 | 337 |
| Italy North | 242 | 242 | 239 | 233 | 268 |
| Japan East | 107 | 107 | 103 | 114 | 127 |
| Japan West | 114 | 114 | 110 | 120 | 135 |
| Korea Central | 129 | 129 | 126 | 138 | 151 |
| Korea South | 123 | 123 | 119 | 135 | 144 |
| Malaysia West | 102 | 101 | 99 | 92 | 122 |
| Mexico Central | 182 | 182 | 179 | 191 | 168 |
| New Zealand North | 31 | 31 | 28 | 40 |  |
| North Central US | 187 | 187 | 185 | 197 | 173 |
| North Europe | 259 | 259 | 256 | 250 | 254 |
| Norway East | 269 | 269 | 266 | 260 | 283 |
| Norway West | 267 | 266 | 263 | 257 | 287 |
| Poland Central | 266 | 266 | 262 | 256 | 286 |
| Qatar Central | 189 | 185 | 185 | 178 | 230 |
| South Africa North | 385 | 385 | 382 | 374 | 393 |
| South Africa West | 368 | 368 | 367 | 359 | 377 |
| South Central US | 165 | 165 | 162 | 174 | 150 |
| South India | 130 | 130 | 127 | 121 | 151 |
| Southeast Asia | 97 | 97 | 94 | 87 | 118 |
| Sweden Central | 292 | 295 | 300 | 276 | 320 |
| Switzerland North | 245 | 245 | 242 | 236 | 271 |
| Switzerland West | 240 | 240 | 237 | 231 | 268 |
| UAE Central | 173 | 172 | 169 | 163 | 193 |
| UAE North | 176 | 175 | 172 | 166 | 196 |
| UK South | 250 | 250 | 247 | 241 | 266 |
| UK West | 256 | 256 | 253 | 246 | 270 |
| West Central US | 165 | 166 | 162 | 173 | 148 |
| West Europe | 255 | 254 | 252 | 246 | 272 |
| West India | 110 | 109 | 107 | 100 | 130 |
| West US | 147 | 147 | 140 | 151 | 133 |
| West US 2 | 166 | 166 | 161 | 172 | 137 |
| West US 3 | 151 | 150 | 147 | 160 | 134 |

#### [Japan](#tab/Japan/APAC)


| Source | Japan East | Japan West |
|---|---|---|
| Australia Central | 108 | 115 |
| Australia Central 2 | 108 | 115 |
| Australia East | 104 | 111 |
| Australia Southeast | 114 | 121 |
| Brazil South | 271 | 279 |
| Canada Central | 159 | 166 |
| Canada East | 168 | 175 |
| Central India | 127 | 128 |
| Central US | 136 | 143 |
| East Asia | 53 | 50 |
| East US | 163 | 172 |
| East US 2 | 163 | 170 |
| France Central | 214 | 217 |
| France South | 203 | 206 |
| Germany North | 241 | 229 |
| Germany West Central | 219 | 222 |
| Indonesia Central |  |  |
| Israel Central | 257 | 258 |
| Italy North | 211 | 214 |
| Japan East |  | 12 |
| Japan West | 12 |  |
| Korea Central | 30 | 20 |
| Korea South | 21 | 14 |
| Malaysia West | 76 | 74 |
| Mexico Central | 146 | 154 |
| New Zealand North | 127 | 135 |
| North Central US | 145 | 153 |
| North Europe | 233 | 239 |
| Norway East | 248 | 241 |
| Norway West | 235 | 238 |
| Poland Central | 249 | 237 |
| Qatar Central | 159 | 160 |
| South Africa North | 355 | 355 |
| South Africa West | 338 | 339 |
| South Central US | 128 | 136 |
| South India | 105 | 102 |
| Southeast Asia | 73 | 69 |
| Sweden Central | 282 | 262 |
| Switzerland North | 214 | 217 |
| Switzerland West | 209 | 212 |
| UAE Central | 150 | 145 |
| UAE North | 153 | 147 |
| UK South | 230 | 222 |
| UK West | 233 | 227 |
| West Central US | 121 | 129 |
| West Europe | 236 | 226 |
| West India | 85 | 82 |
| West US | 108 | 115 |
| West US 2 | 100 | 108 |
| West US 3 | 113 | 121 |

#### [Korea](#tab/Korea/APAC)


| Source | Korea Central | Korea South |
|---|---|---|
| Australia Central | 129 | 123 |
| Australia Central 2 | 130 | 124 |
| Australia East | 126 | 119 |
| Australia Southeast | 139 | 131 |
| Brazil South | 293 | 287 |
| Canada Central | 181 | 174 |
| Canada East | 190 | 183 |
| Central India | 121 | 130 |
| Central US | 157 | 151 |
| East Asia | 41 | 33 |
| East US | 189 | 178 |
| East US 2 | 190 | 178 |
| France Central | 212 | 207 |
| France South | 201 | 196 |
| Germany North | 225 | 219 |
| Germany West Central | 217 | 212 |
| Indonesia Central |  |  |
| Israel Central | 263 | 265 |
| Italy North | 210 | 204 |
| Japan East | 29 | 20 |
| Japan West | 18 | 13 |
| Korea Central |  | 8 |
| Korea South | 9 |  |
| Malaysia West | 69 | 64 |
| Mexico Central | 168 | 162 |
| New Zealand North | 151 | 143 |
| North Central US | 168 | 161 |
| North Europe | 227 | 221 |
| Norway East | 236 | 231 |
| Norway West | 234 | 228 |
| Poland Central | 233 | 228 |
| Qatar Central | 162 | 157 |
| South Africa North | 352 | 346 |
| South Africa West | 337 | 331 |
| South Central US | 153 | 144 |
| South India | 98 | 92 |
| Southeast Asia | 65 | 59 |
| Sweden Central | 261 | 260 |
| Switzerland North | 212 | 207 |
| Switzerland West | 208 | 202 |
| UAE Central | 140 | 134 |
| UAE North | 143 | 137 |
| UK South | 218 | 212 |
| UK West | 223 | 218 |
| West Central US | 144 | 137 |
| West Europe | 222 | 217 |
| West India | 77 | 72 |
| West US | 130 | 124 |
| West US 2 | 123 | 116 |
| West US 3 | 137 | 130 |

#### [India](#tab/India/APAC)


| Source | Central India | South India | West India |
|---|---|---|---|
| Australia Central | 152 | 131 | 144 |
| Australia Central 2 | 154 | 130 | 145 |
| Australia East | 152 | 127 | 140 |
| Australia Southeast | 156 | 121 | 134 |
| Brazil South | 339 | 305 | 285 |
| Canada Central | 248 | 217 | 197 |
| Canada East | 260 | 221 | 199 |
| Central India |  | 22 | 5 |
| Central US | 245 | 231 | 214 |
| East Asia | 89 | 66 | 80 |
| East US | 239 | 204 | 182 |
| East US 2 | 239 | 211 | 190 |
| France Central | 136 | 131 | 113 |
| France South | 124 | 120 | 102 |
| Germany North | 148 | 142 | 125 |
| Germany West Central | 142 | 135 | 117 |
| Indonesia Central |  |  |  |
| Israel Central | 186 | 193 | 156 |
| Italy North | 132 | 127 | 110 |
| Japan East | 125 | 104 | 120 |
| Japan West | 128 | 101 | 115 |
| Korea Central | 124 | 97 | 111 |
| Korea South | 133 | 92 | 105 |
| Malaysia West | 58 | 35 |  |
| Mexico Central | 261 | 252 | 230 |
| New Zealand North | 193 | 150 |  |
| North Central US | 242 | 222 | 202 |
| North Europe | 138 | 144 | 127 |
| Norway East | 164 | 155 | 136 |
| Norway West | 161 | 152 | 135 |
| Poland Central | 160 | 151 | 133 |
| Qatar Central | 47 | 58 | 36 |
| South Africa North | 275 | 276 | 258 |
| South Africa West | 266 | 257 | 236 |
| South Central US | 250 | 235 | 219 |
| South India | 23 |  | 17 |
| Southeast Asia | 58 | 37 | 51 |
| Sweden Central | 218 | 188 | 162 |
| Switzerland North | 133 | 130 | 112 |
| Switzerland West | 129 | 127 | 108 |
| UAE Central | 43 | 46 | 28 |
| UAE North | 45 | 49 | 31 |
| UK South | 135 | 136 | 118 |
| UK West | 158 | 137 | 120 |
| West Central US | 248 | 217 | 234 |
| West Europe | 147 | 143 | 123 |
| West India | 69 | 50 |  |
| West US | 230 | 203 | 217 |
| West US 2 | 219 | 196 | 210 |
| West US 3 | 244 | 221 | 236 |

#### [Asia](#tab/Asia/APAC)


| Source | East Asia | Indonesia Central | Southeast Asia |
|---|---|---|---|
| Australia Central | 122 |  | 98 |
| Australia Central 2 | 123 |  | 98 |
| Australia East | 119 |  | 94 |
| Australia Southeast | 120 |  | 88 |
| Brazil South | 323 |  | 338 |
| Canada Central | 211 |  | 222 |
| Canada East | 220 |  | 231 |
| Central India | 90 |  | 59 |
| Central US | 187 |  | 198 |
| East Asia |  |  | 36 |
| East US | 212 |  | 223 |
| East US 2 | 215 |  | 232 |
| France Central | 182 |  | 149 |
| France South | 171 |  | 139 |
| Germany North | 194 |  | 165 |
| Germany West Central | 187 |  | 158 |
| Indonesia Central |  |  |  |
| Israel Central | 236 |  | 179 |
| Italy North | 179 |  | 148 |
| Japan East | 53 |  | 72 |
| Japan West | 49 |  | 69 |
| Korea Central | 41 |  | 65 |
| Korea South | 33 |  | 59 |
| Malaysia West | 35 | 76 | 9 |
| Mexico Central | 198 |  | 220 |
| New Zealand North | 143 | 213 | 117 |
| North Central US | 197 |  | 208 |
| North Europe | 196 |  | 166 |
| Norway East | 206 |  | 176 |
| Norway West | 203 |  | 174 |
| Poland Central | 203 |  | 173 |
| Qatar Central | 119 |  | 93 |
| South Africa North | 338 |  | 292 |
| South Africa West | 307 |  | 276 |
| South Central US | 177 |  | 202 |
| South India | 67 |  | 38 |
| Southeast Asia | 36 |  |  |
| Sweden Central | 217 |  | 200 |
| Switzerland North | 182 |  | 151 |
| Switzerland West | 177 |  | 148 |
| UAE Central | 109 |  | 80 |
| UAE North | 113 |  | 83 |
| UK South | 187 |  | 154 |
| UK West | 193 |  | 161 |
| West Central US | 174 |  | 184 |
| West Europe | 191 |  | 162 |
| West India | 48 | 88 | 17 |
| West US | 159 |  | 171 |
| West US 2 | 152 |  | 163 |
| West US 3 | 165 |  | 187 |

#### [Middle East](#tab/MiddleEast/MEA)


| Source | Israel Central | Qatar Central | UAE Central | UAE North |
|---|---|---|---|---|
| Australia Central | 299 | 188 | 173 | 176 |
| Australia Central 2 | 300 | 190 | 173 | 177 |
| Australia East | 314 | 184 | 170 | 173 |
| Australia Southeast | 291 | 178 | 163 | 167 |
| Brazil South | 240 | 306 | 283 | 285 |
| Canada Central | 155 | 213 | 197 | 196 |
| Canada East | 159 | 230 | 198 | 201 |
| Central India | 183 | 49 | 44 | 45 |
| Central US | 169 | 249 | 213 | 215 |
| East Asia | 223 | 119 | 109 | 112 |
| East US | 137 | 197 | 182 | 183 |
| East US 2 | 135 | 198 | 190 | 189 |
| France Central | 53 | 121 | 113 | 114 |
| France South | 42 | 113 | 101 | 103 |
| Germany North | 63 | 137 | 125 | 126 |
| Germany West Central | 55 | 128 | 118 | 119 |
| Indonesia Central | 207 |  |  |  |
| Israel Central |  | 152 | 143 | 141 |
| Italy North | 48 | 119 | 109 | 111 |
| Japan East | 257 | 159 | 150 | 152 |
| Japan West | 257 | 161 | 144 | 147 |
| Korea Central | 263 | 158 | 140 | 143 |
| Korea South | 263 | 156 | 134 | 138 |
| Malaysia West | 208 |  | 78 | 81 |
| Mexico Central | 183 | 262 | 228 | 230 |
| New Zealand North | 337 |  | 193 | 195 |
| North Central US | 157 | 237 | 200 | 201 |
| North Europe | 76 | 136 | 127 | 128 |
| Norway East | 84 | 152 | 137 | 138 |
| Norway West | 83 | 161 | 134 | 135 |
| Poland Central | 72 | 148 | 133 | 135 |
| Qatar Central | 147 |  | 16 | 20 |
| South Africa North | 204 | 270 | 254 | 254 |
| South Africa West | 188 | 260 | 236 | 237 |
| South Central US | 173 | 261 | 218 | 217 |
| South India | 191 | 57 | 46 | 50 |
| Southeast Asia | 180 | 94 | 79 | 82 |
| Sweden Central | 98 | 170 | 148 | 153 |
| Switzerland North | 51 | 127 | 113 | 114 |
| Switzerland West | 54 | 121 | 108 | 109 |
| UAE Central | 143 | 16 |  | 6 |
| UAE North | 141 | 20 | 6 |  |
| UK South | 66 | 130 | 118 | 120 |
| UK West | 211 | 140 | 123 | 124 |
| West Central US | 183 | 263 | 230 | 231 |
| West Europe | 68 | 132 | 123 | 124 |
| West India | 207 |  | 92 | 96 |
| West US | 204 | 264 | 252 | 253 |
| West US 2 | 206 | 259 | 244 | 249 |
| West US 3 | 205 | 267 | 243 | 242 |

#### [Africa](#tab/Africa/MEA)


| Source | South Africa North | South Africa West |
|---|---|---|
| Australia Central | 385 | 369 |
| Australia Central 2 | 385 | 369 |
| Australia East | 385 | 367 |
| Australia Southeast | 375 | 359 |
| Brazil South | 319 | 303 |
| Canada Central | 233 | 216 |
| Canada East | 241 | 224 |
| Central India | 275 | 265 |
| Central US | 248 | 232 |
| East Asia | 338 | 306 |
| East US | 217 | 200 |
| East US 2 | 214 | 198 |
| France Central | 160 | 144 |
| France South | 154 | 138 |
| Germany North | 170 | 153 |
| Germany West Central | 164 | 147 |
| Indonesia Central |  |  |
| Israel Central | 205 | 199 |
| Italy North | 166 | 149 |
| Japan East | 356 | 338 |
| Japan West | 355 | 338 |
| Korea Central | 352 | 336 |
| Korea South | 346 | 330 |
| Malaysia West | 296 | 280 |
| Mexico Central | 258 | 240 |
| New Zealand North | 393 | 376 |
| North Central US | 237 | 221 |
| North Europe | 176 | 159 |
| Norway East | 181 | 166 |
| Norway West | 178 | 162 |
| Poland Central | 179 | 162 |
| Qatar Central | 269 | 260 |
| South Africa North |  | 20 |
| South Africa West | 21 |  |
| South Central US | 239 | 222 |
| South India | 276 | 258 |
| Southeast Asia | 292 | 276 |
| Sweden Central | 198 | 179 |
| Switzerland North | 165 | 148 |
| Switzerland West | 160 | 144 |
| UAE Central | 256 | 235 |
| UAE North | 254 | 237 |
| UK South | 161 | 145 |
| UK West | 171 | 153 |
| West Central US | 257 | 240 |
| West Europe | 167 | 150 |
| West India | 305 | 288 |
| West US | 278 | 262 |
| West US 2 | 278 | 262 |
| West US 3 | 265 | 249 |


---

Additionally, you can view all of the data in a single table.

:::image type="content" source="media/azure-network-latency/azure-network-latency.png" alt-text="Screenshot of full region latency table." lightbox="media/azure-network-latency/azure-network-latency-expanded.png":::

## Next steps

Learn about [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/).