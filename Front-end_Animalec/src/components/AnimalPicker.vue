<template>
  <div class="animal-picker">
    <div class="form-group">
      <label :for="filterId">Pesquisar animal</label>
      <input
        :id="filterId"
        v-model="filter"
        type="search"
        class="form-control"
        placeholder="escreve parte do nome"
      />
    </div>

    <p class="mb-1" :id="badgesId">{{label}}:</p>
    <ul class="list-unstyled mb-3" :aria-labelledby="badgesId">
      <li v-if="selectedAnimals.length === 0" class="text-muted">Nenhum animal associado.</li>
      <li v-for="animal in selectedAnimals" :key="animal._id" class="d-inline-block mr-2 mb-1">
        <b-badge variant="secondary" class="p-2">
          {{animal.name}}
          <button
            type="button"
            class="btn btn-sm btn-link text-white p-0 ml-1"
            :aria-label="'Remover ' + animal.name"
            @click="toggle(animal._id)"
          >
            <i class="fas fa-times" aria-hidden="true"></i>
          </button>
        </b-badge>
      </li>
    </ul>

    <div class="picker-list border rounded p-2">
      <div v-if="filteredAnimals.length === 0" class="text-muted">Nenhum animal encontrado.</div>
      <div v-for="animal in filteredAnimals" :key="animal._id" class="custom-control custom-checkbox">
        <input
          :id="checkId(animal._id)"
          type="checkbox"
          class="custom-control-input"
          :checked="value.includes(animal._id)"
          @change="toggle(animal._id)"
        />
        <label class="custom-control-label" :for="checkId(animal._id)">
          {{animal.name}} ({{animal.group}})
        </label>
      </div>
    </div>
  </div>
</template>

<script>
let uid = 0;

export default {
  name: "AnimalPicker",
  props: {
    // Lista completa de animais: [{ _id, name, group }]
    animals: { type: Array, default: () => [] },
    // Ids dos animais selecionados
    value: { type: Array, default: () => [] },
    label: { type: String, default: "Animais associados" }
  },
  data() {
    uid += 1;
    return { filter: "", uid };
  },
  computed: {
    filterId() {
      return `picker-filter-${this.uid}`;
    },
    badgesId() {
      return `picker-badges-${this.uid}`;
    },
    filteredAnimals() {
      const term = this.filter.trim().toLowerCase();
      return this.animals.filter(animal => animal.name.toLowerCase().includes(term));
    },
    selectedAnimals() {
      return this.value.map(id => this.animals.find(animal => animal._id === id)).filter(Boolean);
    }
  },
  methods: {
    checkId(id) {
      return `picker-${this.uid}-${id}`;
    },
    toggle(id) {
      const selected = this.value.includes(id)
        ? this.value.filter(item => item !== id)
        : [...this.value, id];
      this.$emit("input", selected);
    }
  }
};
</script>

<style scoped>
.picker-list {
  max-height: 14rem;
  overflow-y: auto;
}
</style>
