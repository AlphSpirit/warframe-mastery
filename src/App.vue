<template>
  <div class="containerContainer">
    <div class="container">
      <div class="column">
        <div class="title">Settings</div>
        <div class="element">
          <div class="name">Total : {{ totalMastered }}/{{ totalItems }} ({{ Math.round(totalMastered / totalItems * 100) }}%)</div>
        </div>
        <div class="element" :class="{active: hideMastered}" >
          <div class="name">Hide mastered</div>
          <div class="completed" :class="{active: hideMastered}" @click="toggleHideMastered">✓</div>
        </div>
        <div class="element">
          <div class="name">Size : {{ Math.round(JSON.stringify(mastered).length * 16 / 1000) }}kb</div>
        </div>
      </div>
      <div class="column" :class="{hidden: howManyMastered(category.items) == category.items.length}" v-for="category of categories" :key="category.name">
        <div class="title">{{ category.name }} ({{ howManyMastered(category.items) }}/{{ category.items.length }})</div>
        <div class="element" :class="{active: isMastered(item), hidden: hideMastered && isMastered(item)}" v-for="item of category.items" :key="item.name">
          <div class="name">{{ item.name }}</div>
          <div class="completed" :class="{active: isMastered(item)}" @click="toggleMastery(item)">✓</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import Warframes from "./assets/Warframes.json";
  import Primaries from "./assets/Primary.json";
  import Secondaries from "./assets/Secondary.json";
  import Melees from "./assets/Melee.json";
  import Sentinels from "./assets/Sentinels.json";
  import SentinelWeapons from "./assets/SentinelWeapons.json";
  import Pets from "./assets/Pets.json";
  import Archmelees from "./assets/Arch-Melee.json";
  import Archwings from "./assets/Archwing.json";
  import Misc from "./assets/Misc.json";

  export default {
    data() {
      return {
        mastered: JSON.parse(localStorage.getItem("warframe-mastery") || "{}"),
        founders: ["Excalibur Prime", "Lato Prime", "Skana Prime"],
        hideMastered: localStorage.getItem("warframe-mastery-hidemastered"),
        categories: []
      };
    },
    async mounted() {
      this.categories = [{
          name: "Warframes",
          items: Warframes.filter(w => w.productCategory == "Suits" && this.founders.indexOf(w.name) == -1)
        }, {
          name: "Primary",
          items: Primaries.filter(p => p.productCategory == "LongGuns")
        }, {
          name: "Secondary",
          items: Secondaries.filter(s => this.founders.indexOf(s.name) == -1)
        }, {
          name: "Melee",
          items: Melees.filter(m => this.founders.indexOf(m.name) == -1)
        }, {
          name: "Kitguns",
          items: Misc.filter(m => (m.type == "Melee" && m.productCategory == "Pistols" && m.uniqueName.indexOf("PvP") == -1
              && m.uniqueName.indexOf("Balance") == -1 && m.uniqueName.indexOf("Handle") == -1
              && m.uniqueName.indexOf("MoaPets") == -1) || m.primeOmegaAttenuation > 0)
        }, {
          name: "Robotics",
          items: [...Sentinels, ...SentinelWeapons, ...Misc.filter(m => m.name.indexOf("Hound") > -1), ...Pets.filter(p => p.name.indexOf("Moa") > -1 && p.productCategory == "Pistols")].sort((a, b) => a.name.localeCompare(b.name))
        }, {
          name: "Companions",
          items: Pets.filter(p => p.productCategory != "Pistols")
        }, {
          name: "Vehicles",
          items: [...Warframes.filter(w => w.productCategory == "MechSuits"),
            ...Misc.filter(m => m.uniqueName.indexOf("Hoverboard") > -1 && m.productCategory == "Pistols" && m.uniqueName.indexOf("Deck") > -1),
            ...Archwings,
            {name: "Plexus"}].sort((a, b) => a.name.localeCompare(b.name))
        }, {
          name: "Archguns",
          items: [...Primaries.filter(p => p.productCategory == "SpaceGuns"), {name: "Prisma Dual Decurions"}].sort((a, b) => a.name.localeCompare(b.name))
        }, {
          name: "Archmelees",
          items: Archmelees
        }, {
          name: "Amps",
          items: Misc.filter(m => m.name.indexOf("Prism") > -1 && m.productCategory == "Pistols")
        }];
    },
    computed: {
      isMastered() {
        return item => {
          return this.mastered[item.name];
        };
      },
      howManyMastered() {
        return items => {
          return items.filter(i => this.isMastered(i)).length;
        }
      },
      totalItems() {
        return this.categories.reduce((p, c) => p + c.items.length, 0);
      },
      totalMastered() {
        return this.categories.reduce((p, c) => p + this.howManyMastered(c.items), 0);
      }
    },
    methods: {
      toggleMastery(item) {
        if (this.mastered[item.name]) {
          delete this.mastered[item.name];
        } else {
          this.mastered[item.name] = true;
        }
        this.save();
      },
      save() {
        localStorage.setItem("warframe-mastery", JSON.stringify(this.mastered));
      },
      toggleHideMastered() {
        this.hideMastered = !this.hideMastered;
        localStorage.setItem("warframe-mastery-hidemastered", this.hideMastered);
      }
    }
  }

</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

body {
  font-family: "Cairo";
  background-color: #090C10;
}

* {
  box-sizing: border-box;
}

#app {
  color: #c9d1d9;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.containerContainer {
  display: flex;
  padding: 10px;
}

.container {
  display: flex;
}

.column {
  &.hidden {
    display: none;
  }
  margin-right: 10px;
  .title {
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
    white-space: nowrap;
  }
}

.element {
  background-color: #0D1117;
  border: 1px solid #30363D;
  display: flex;
  border-radius: 6px;
  &.active {
    background-color: #08210d;
    border-color: #2EA043;
  }
  &.hidden {
    display: none;
  }
  margin-top: 10px;
  .name {
    padding: 5px 12px;
    text-transform: uppercase;
    white-space: nowrap;
    flex-grow: 1;
  }
  .completed {
    width: 40px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    border-left: 1px solid #30363D;
    user-select: none;
    cursor: pointer;
    &.active {
      background-color: #238636;
      border-left: 1px solid #2EA043;
      color: white;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
}
</style>
