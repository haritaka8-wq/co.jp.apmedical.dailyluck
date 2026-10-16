package com.waunreki.fortune

import com.waunreki.fortune.domain.engine.FiveElement
import com.waunreki.fortune.domain.engine.FiveElementsEngine
import com.waunreki.fortune.domain.engine.YinYang
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test
import java.time.LocalDate

class FiveElementsEngineTest {

    private lateinit var engine: FiveElementsEngine

    @Before
    fun setUp() {
        engine = FiveElementsEngine()
    }

    @Test
    fun testDateValidation() {
        assertTrue(engine.isValidDate(2024, 2, 29)) // leap year
        assertFalse(engine.isValidDate(2023, 2, 29)) // common year
        assertFalse(engine.isValidDate(2024, 4, 31)) // April 31 invalid
        assertTrue(engine.isValidDate(1990, 12, 31))
    }

    @Test
    fun testBirthTypeFormula() {
        // N = (Y + 3*M + 7*D) mod 10
        val t1 = engine.calculateBirthType(2000, 1, 1) // 2000 + 3 + 7 = 2010 -> 0 (Wood Yang)
        assertEquals(0, t1.number)
        assertEquals(FiveElement.WOOD, t1.element)
        assertEquals(YinYang.YANG, t1.yinYang)

        val t2 = engine.calculateBirthType(1995, 8, 15) // 1995 + 24 + 105 = 2124 -> 4 (Earth Yang)
        assertEquals(4, t2.number)
        assertEquals(FiveElement.EARTH, t2.element)
    }

    @Test
    fun testDayElementFormula() {
        // 1970-01-01 -> epoch day 0 -> Wood
        val day0 = engine.calculateDayElement(LocalDate.of(1970, 1, 1))
        assertEquals(FiveElement.WOOD, day0)

        // 1970-01-02 -> epoch day 1 -> Fire
        val day1 = engine.calculateDayElement(LocalDate.of(1970, 1, 2))
        assertEquals(FiveElement.FIRE, day1)
    }

    @Test
    fun testShengDirection() {
        assertTrue(engine.generates(FiveElement.WOOD, FiveElement.FIRE))
        assertFalse(engine.generates(FiveElement.FIRE, FiveElement.WOOD)) // direction check
        assertTrue(engine.generates(FiveElement.FIRE, FiveElement.EARTH))
        assertTrue(engine.generates(FiveElement.EARTH, FiveElement.METAL))
        assertTrue(engine.generates(FiveElement.METAL, FiveElement.WATER))
        assertTrue(engine.generates(FiveElement.WATER, FiveElement.WOOD))
    }

    @Test
    fun testKeDirection() {
        assertTrue(engine.controls(FiveElement.WOOD, FiveElement.EARTH))
        assertFalse(engine.controls(FiveElement.EARTH, FiveElement.WOOD)) // direction check
        assertTrue(engine.controls(FiveElement.EARTH, FiveElement.WATER))
        assertTrue(engine.controls(FiveElement.WATER, FiveElement.FIRE))
        assertTrue(engine.controls(FiveElement.FIRE, FiveElement.METAL))
        assertTrue(engine.controls(FiveElement.METAL, FiveElement.WOOD))
    }

    @Test
    fun testFortuneScoreRules() {
        // B=WOOD, P=WOOD, D=WOOD -> BD=+2 (same), PD=+1 (same) -> total=+3
        val res1 = engine.calculateFortuneScore(FiveElement.WOOD, FiveElement.WOOD, FiveElement.WOOD)
        assertEquals(2, res1.bdScore)
        assertEquals(1, res1.pdScore)
        assertEquals(3, res1.totalScore)
        assertEquals("順調", res1.rankNameJa)

        // D generates B (D=WATER, B=WOOD) -> +2. P=FIRE (P & D in Ke: Water controls Fire) -> -1 -> total = +1
        val res2 = engine.calculateFortuneScore(FiveElement.WOOD, FiveElement.FIRE, FiveElement.WATER)
        assertEquals(2, res2.bdScore)
        assertEquals(-1, res2.pdScore)
        assertEquals(1, res2.totalScore)
        assertEquals("安定", res2.rankNameJa)
    }

    @Test
    fun testRankBoundaries() {
        assertEquals("好調", engine.getFortuneRank(5))
        assertEquals("好調", engine.getFortuneRank(6))
        assertEquals("順調", engine.getFortuneRank(4))
        assertEquals("順調", engine.getFortuneRank(3))
        assertEquals("安定", engine.getFortuneRank(2))
        assertEquals("安定", engine.getFortuneRank(1))
        assertEquals("整える日", engine.getFortuneRank(0))
        assertEquals("慎重に進む日", engine.getFortuneRank(-1))
        assertEquals("慎重に進む日", engine.getFortuneRank(-2))
    }
}
