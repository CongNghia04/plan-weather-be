/**
 * Nhập đường phố TP.HCM từ OpenStreetMap (Overpass API) vào bảng StreetSegment.
 * Xem docs/flows/data-ingestion.md mục "Nhập dữ liệu tĩnh".
 * TODO: query Overpass `way[highway][name](area:HCM)` -> chia đoạn -> INSERT với ST_GeomFromGeoJSON.
 */
console.log('TODO: import OSM streets');
