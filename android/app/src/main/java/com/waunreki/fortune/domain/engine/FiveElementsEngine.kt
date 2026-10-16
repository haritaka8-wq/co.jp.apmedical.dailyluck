package com.waunreki.fortune.domain.engine

import java.time.LocalDate
import java.time.temporal.ChronoUnit

/**
 * 陰陽五行 計算エンジン (Kotlin Implementation)
 */
enum class FiveElement(val order: Int, val kanji: String, val nameJa: String, val nameEn: String) {
    WOOD(0, "木", "木 (もく)", "Wood"),
    FIRE(1, "火", "火 (か)", "Fire"),
    EARTH(2, "土", "土 (ど)", "Earth"),
    METAL(3, "金", "金 (ごん)", "Metal"),
    WATER(4, "水", "水 (すい)", "Water")
}

enum class YinYang(val nameJa: String, val nameEn: String) {
    YANG("陽", "Yang"),
    YIN("陰", "Yin")
}

data class BirthType(
    val number: Int, // 0..9
    val element: FiveElement,
    val yinYang: YinYang,
    val nameJa: String,
    val nameEn: String
)

data class FortuneScoreResult(
    val bdScore: Int,
    val pdScore: Int,
    val totalScore: Int,
    val rankNameJa: String,
    val rankNameEn: String
)

class FiveElementsEngine {

    /**
     * 1. 生年月日からの独自五行タイプ判定: N = (Y + 3×M + 7×D) mod 10
     */
    fun calculateBirthType(year: Int, month: Int, day: Int): BirthType {
        require(isValidDate(year, month, day)) { "Invalid Gregorian date: $year-$month-$day" }
        val rawN = (year + 3 * month + 7 * day) % 10
        val n = (rawN + 10) % 10

        val (element, yinYang, nameJa, nameEn) = when (n) {
            0 -> Tuple4(FiveElement.WOOD, YinYang.YANG, "木・陽", "Wood · Yang")
            1 -> Tuple4(FiveElement.WOOD, YinYang.YIN, "木・陰", "Wood · Yin")
            2 -> Tuple4(FiveElement.FIRE, YinYang.YANG, "火・陽", "Fire · Yang")
            3 -> Tuple4(FiveElement.FIRE, YinYang.YIN, "火・陰", "Fire · Yin")
            4 -> Tuple4(FiveElement.EARTH, YinYang.YANG, "土・陽", "Earth · Yang")
            5 -> Tuple4(FiveElement.EARTH, YinYang.YIN, "土・陰", "Earth · Yin")
            6 -> Tuple4(FiveElement.METAL, YinYang.YANG, "金・陽", "Metal · Yang")
            7 -> Tuple4(FiveElement.METAL, YinYang.YIN, "金・陰", "Metal · Yin")
            8 -> Tuple4(FiveElement.WATER, YinYang.YANG, "水・陽", "Water · Yang")
            else -> Tuple4(FiveElement.WATER, YinYang.YIN, "水・陰", "Water · Yin")
        }

        return BirthType(n, element, yinYang, nameJa, nameEn)
    }

    /**
     * 2. 当日の五行判定: 1970年1月1日からの経過日数 mod 5
     */
    fun calculateDayElement(date: LocalDate): FiveElement {
        val epoch = LocalDate.of(1970, 1, 1)
        val days = ChronoUnit.DAYS.between(epoch, date)
        val remainder = (((days % 5) + 5) % 5).toInt()
        return FiveElement.values()[remainder]
    }

    /**
     * 3. 相生 (Sheng)
     */
    fun generates(a: FiveElement, b: FiveElement): Boolean = when (a) {
        FiveElement.WOOD -> b == FiveElement.FIRE
        FiveElement.FIRE -> b == FiveElement.EARTH
        FiveElement.EARTH -> b == FiveElement.METAL
        FiveElement.METAL -> b == FiveElement.WATER
        FiveElement.WATER -> b == FiveElement.WOOD
    }

    /**
     * 4. 相剋 (Ke)
     */
    fun controls(a: FiveElement, b: FiveElement): Boolean = when (a) {
        FiveElement.WOOD -> b == FiveElement.EARTH
        FiveElement.EARTH -> b == FiveElement.WATER
        FiveElement.WATER -> b == FiveElement.FIRE
        FiveElement.FIRE -> b == FiveElement.METAL
        FiveElement.METAL -> b == FiveElement.WOOD
    }

    fun isSheng(a: FiveElement, b: FiveElement): Boolean = generates(a, b) || generates(b, a)
    fun isKe(a: FiveElement, b: FiveElement): Boolean = controls(a, b) || controls(b, a)

    /**
     * 5. 日運スコア計算
     */
    fun calculateFortuneScore(b: FiveElement, p: FiveElement, d: FiveElement): FortuneScoreResult {
        // B & D relation
        val bdScore = when {
            b == d -> 2
            generates(d, b) -> 2
            generates(b, d) -> 1
            controls(b, d) -> 1
            else -> -1
        }

        // P & D relation
        val pdScore = when {
            p == d -> 1
            isSheng(p, d) -> 1
            else -> -1
        }

        val total = bdScore + pdScore
        val (rankJa, rankEn) = when {
            total >= 5 -> "好調" to "Excellent"
            total in 3..4 -> "順調" to "Smooth"
            total in 1..2 -> "安定" to "Stable"
            total == 0 -> "整える日" to "Align"
            else -> "慎重に進む日" to "Cautious"
        }

        return FortuneScoreResult(bdScore, pdScore, total, rankJa, rankEn)
    }

    fun isValidDate(year: Int, month: Int, day: Int): Boolean {
        if (year !in 1900..2100 || month !in 1..12 || day !in 1..31) return false
        val isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)
        val daysInMonth = intArrayOf(31, if (isLeap) 29 else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31)
        return day <= daysInMonth[month - 1]
    }

    private data class Tuple4<A, B, C, D>(val a: A, val b: B, val c: C, val d: D)
}
