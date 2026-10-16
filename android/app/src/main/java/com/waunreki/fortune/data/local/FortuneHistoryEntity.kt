package com.waunreki.fortune.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

/**
 * Room Database Entity for Fortune History (30+ Days Offline Storage)
 */
@Entity(tableName = "fortune_history")
data class FortuneHistoryEntity(
    @PrimaryKey val date: String, // YYYY-MM-DD
    val epochDays: Long,
    val dayElement: String,
    val birthElement: String,
    val birthYinYang: String,
    val primaryElement: String,
    val auxiliaryElement: String,
    val totalScore: Int,
    val rankKey: String,
    val rankNameJa: String,
    val rankNameEn: String,
    val luckyColorHex: String,
    val luckyColorNameJa: String,
    val overallAdviceJa: String,
    val overallAdviceEn: String,
    val createdAt: Long = System.currentTimeMillis()
)

@Dao
interface FortuneHistoryDao {
    @Query("SELECT * FROM fortune_history ORDER BY date DESC LIMIT 60")
    fun getAllHistory(): Flow<List<FortuneHistoryEntity>>

    @Query("SELECT * FROM fortune_history WHERE date = :targetDate LIMIT 1")
    suspend fun getByDate(targetDate: String): FortuneHistoryEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFortune(fortune: FortuneHistoryEntity)

    @Query("DELETE FROM fortune_history")
    suspend fun clearAll()
}

@Database(entities = [FortuneHistoryEntity::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun fortuneDao(): FortuneHistoryDao
}
