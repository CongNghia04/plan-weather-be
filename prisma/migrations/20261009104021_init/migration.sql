-- PostGIS cho cột geometry
CREATE EXTENSION IF NOT EXISTS postgis;

-- CreateTable
CREATE TABLE "StreetSegment" (
    "id" TEXT NOT NULL,
    "osmId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "ward" TEXT,
    "geom" geometry(LineString, 4326) NOT NULL,
    "elevationM" DOUBLE PRECISION,

    CONSTRAINT "StreetSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FloodPoint" (
    "id" TEXT NOT NULL,
    "segmentId" TEXT,
    "description" TEXT NOT NULL,
    "cause" TEXT NOT NULL,
    "maxDepthCm" INTEGER,
    "geom" geometry(Point, 4326) NOT NULL,

    CONSTRAINT "FloodPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeatherForecast" (
    "id" TEXT NOT NULL,
    "gridKey" TEXT NOT NULL,
    "forecastAt" TIMESTAMP(3) NOT NULL,
    "rainMm" DOUBLE PRECISION NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeatherForecast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TideForecast" (
    "id" TEXT NOT NULL,
    "station" TEXT NOT NULL,
    "forecastAt" TIMESTAMP(3) NOT NULL,
    "levelCm" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TideForecast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FloodPrediction" (
    "id" TEXT NOT NULL,
    "segmentId" TEXT NOT NULL,
    "validAt" TIMESTAMP(3) NOT NULL,
    "riskScore" DOUBLE PRECISION NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "depthCmEst" INTEGER,
    "factors" JSONB NOT NULL,
    "modelVer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FloodPrediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FloodReport" (
    "id" TEXT NOT NULL,
    "segmentId" TEXT,
    "depthCm" INTEGER NOT NULL,
    "note" TEXT,
    "geom" geometry(Point, 4326) NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FloodReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StreetSegment_osmId_key" ON "StreetSegment"("osmId");

-- CreateIndex
CREATE INDEX "StreetSegment_name_idx" ON "StreetSegment"("name");

-- CreateIndex
CREATE INDEX "StreetSegment_district_idx" ON "StreetSegment"("district");

-- CreateIndex
CREATE UNIQUE INDEX "WeatherForecast_gridKey_forecastAt_key" ON "WeatherForecast"("gridKey", "forecastAt");

-- CreateIndex
CREATE UNIQUE INDEX "TideForecast_station_forecastAt_key" ON "TideForecast"("station", "forecastAt");

-- CreateIndex
CREATE INDEX "FloodPrediction_validAt_idx" ON "FloodPrediction"("validAt");

-- CreateIndex
CREATE UNIQUE INDEX "FloodPrediction_segmentId_validAt_modelVer_key" ON "FloodPrediction"("segmentId", "validAt", "modelVer");

-- AddForeignKey
ALTER TABLE "FloodPoint" ADD CONSTRAINT "FloodPoint_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "StreetSegment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FloodPrediction" ADD CONSTRAINT "FloodPrediction_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "StreetSegment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FloodReport" ADD CONSTRAINT "FloodReport_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "StreetSegment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
