# Signal Wars — Story, Missions & Epochs

> Unofficial HertzFlow fan game. No wallet, no real money. Missions are short (5–10 min) so they're live-stream friendly.

## The plot (one page)
The HertzFlow islands run on **the Signal** — a sky-blue frequency that keeps the markets calm and the islands alive. One night, a wave of over-leveraged positions collapses all at once. The liquidation shockwave cracks the Signal, and from the cracks pours **the Static**: red-candle creatures born from every blown-up trade.

At its heart is **The Master**, an entity that feeds on leverage. It whispers to traders: *"2x is for cowards. Go 100x."* Every greedy position makes it stronger.

The **Signal Keepers** — Hero, Bankyo and Zayn, backed by Hertzling, Lyra, Kael, Chado and the Warden — answer the call. Each mission starts the same way: a speedboat cutting through dark water, the radio crackling **"Almost there…"**, fade to black, and boots on the sand.

Island by island they restore Signal Towers, push back the Static, and earn **Merits**. Clues point to the desert **Dust Array**, a giant antenna The Master is using to broadcast the Static to the whole world. Before the finale, the Keepers must break the **Binance Siege**, where the Static has surrounded the diamond island in a storm.

Theme: **discipline beats greed.** Leverage is power, but the Master is what happens when you lose control.

---

## Mission 01 — "First Signal" (Ember Dot) — full beat sheet
**Length:** ~6 min · **Playable:** Zayn (default), Hero, Bankyo · **Teaches:** move, Wave, dodge, Rampage.

| Beat | What happens | Objective on screen | Dialogue beat |
|------|--------------|---------------------|---------------|
| 0. Boat | Speedboat at night, Ember Dot glowing red on horizon. Title card. | — | **Warden (radio):** "Ember Dot went dark an hour ago. Signal's gone. Almost there…" |
| 1. Fade in | Black → beach, weapon in hand. | Reach the shore cliffs | **Zayn:** "Smells like a blown margin account." |
| 2. First contact | 3 Static Crabs. Tutorial prompts for WAVE. | Clear the beach (0/3) | **Warden:** "Those are crabs. Ugly. Easy. Hit them." |
| 3. Rushers | 2 Wick Runners dash in; red line telegraph. | Dodge a dash ✓ / Defeat Runners | **Warden:** "See the red line? Don't be on it." |
| 4. Tower 1 | Find Signal Tower, hold zone for 20s while crabs attack. | Restore Tower 1 (hold 20s) | Tower pulses sky-blue. **Zayn:** "That's more like it." |
| 5. Rampage | Flow meter fills; prompt to trigger Rampage on a big wave. | Use ROAR | **Warden:** "Flow's full. Let it rip." |
| 6. Mini-boss | Red Candle Brute rises from the crater. | Defeat the Red Candle Brute | **Brute (distorted):** "…LIQUIDATE…" At 30%: "LIQUIDATION MODE." |
| 7. Clue | Brute drops a cracked chip showing the Dust Array map. | Pick up the chip | **Warden:** "That's a broadcast key… from the desert. Someone's behind this." |
| 8. Outro | Island lights up sky-blue. Results screen. | — | **Zayn:** "One island down." |

### Mission 01 section levels (shipped build)
Boat "Almost There" intro → fade onto Ember Dot, then:

| # | Section | Ground | Objective | Waves | Exit |
|---|---------|--------|-----------|-------|------|
| 1 | **SHORE LANDING** | warm sand | Clear the beach | 24 crabs → 30 crabs + 10 Wick Runners | all Static down |
| 2 | **TOWER RIDGE** | teal | Restore Signal Tower 1 — stand in the ring 15s | 36 crabs + 14 wicks → 44 crabs + 22 wicks; crab packs keep coming until the tower is restored | tower restored + field clear |
| 3 | **CRATER GATE** | ember red | Defeat the Red Candle Brute | 30 crabs + 20 wicks → **Brute** + 40 crabs + 16 wicks | Brute and adds down → MISSION COMPLETE |

Beats 1–3 above map to Section 1, beats 4–5 to Section 2, beats 6–8 to Section 3.

**Rewards:** 100 Merits · +1 Signal Tower lit · Unlock Moonleaf Oval · Cosmetic: "First Signal" badge · Bonus 25 Merits for no-damage Brute kill.
**Fail state:** LIQUIDATED → Retry Section (restart the current section, no game-over spiral) or Run It Back from the boat.

---

## Missions 02–05 (outline)
**02 — "Moonlight Static" (Moonleaf Oval)** · Lyra joins. Night forest, Glitch Moth swarms blur vision. Escort a lantern drone through the trees, light 3 moon shrines. Boss-lite: giant Moth Queen swarm.

**03 — "Margin Call" (The h)** · Kael joins. Vertical rooftop island shaped like the h. Margin Caller snipers on high points; climb and clear sniper nests, then defend the top of the h tower. Twist: Chado appears, hooded, and saves you — or is he watching?

**04 — "Low Tide" (Tidering Oval)** · Bankyo's home. Tide Leeches drain Flow along the ring shore. Raise 4 tide gates in order before the water floods; Bankyo's water powers shine.

**05 — "Fool's Gold" (Gold Dot)** · Hertzling joins. Loot vault full of Gold Mimics. Find the real Signal Key among fakes; hidden reward for not getting greedy (open fewer chests = more Merits). Ends with the Warden revealing the Binance Siege.

**Later:** 06 Binance Siege (storm defense, Liquidator Drones) → 07–08 Dust Array → The Master.

---

## Epochs (weekly structure)
An **Epoch** = one real-world week.
- **Mon reset:** new Epoch modifier, e.g. *"10x Week"* (enemies + rewards ×1.5), *"Storm Week"* (lightning hazards), *"Calm Market"* (chill, more Flow).
- **3 weekly tasks**, e.g. "Defeat 50 Wick Runners", "Finish Mission 01 under 5 min", "Win a Brute fight with only Wave".
- **Epoch Leaderboard:** best mission time + Merits. Great for streamers racing each other.
- **Epoch end:** badge + rank title (Paper Hands → Diamond Hands → Signal Keeper).

## Tasks & quests without bloating the MVP
- **One list, three slots:** daily (1), weekly (3), story (current mission). That's it.
- Tasks are **counters on events we already fire** (kills, time, power used) — no new systems.
- Saved in `localStorage` for the MVP; server leaderboard later.
- Rewards = **Merits** (one currency) → cosmetics and character unlocks only. No pay-to-win, no real money.
- No crafting, no inventory, no open world. Every mission is a hand-built 5–10 min run.

## Logo-map beats
- HertzFlow: Drop Shore → Left Pill → H Bridge (Brute) → Right Pill → Extract Gate.
- Binance Siege: storm landing → diamond channels → East Fort (Brute: "LIQUIDATE") → outer L → Diamond Core.
