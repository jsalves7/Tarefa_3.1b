<template>
  <form @submit.prevent="$emit('submit')">
    <fieldset class="mb-4">
      <legend>Dados de identificação</legend>
      <div class="form-group">
        <label for="txtName">Nome</label>
        <input
          id="txtName"
          v-model="expert.name"
          type="text"
          class="form-control form-control-lg"
          placeholder="escreve nome"
          required
        />
      </div>
      <div class="form-group">
        <label for="txtTitle">Título académico</label>
        <input
          id="txtTitle"
          v-model="expert.title"
          type="text"
          class="form-control form-control-lg"
          placeholder="ex.: Doutor em Biologia"
        />
      </div>
      <div class="form-group">
        <label for="txtInstitution">Instituição</label>
        <input
          id="txtInstitution"
          v-model="expert.institution"
          type="text"
          list="lstInstitutions"
          class="form-control form-control-lg"
          placeholder="escreve instituição"
        />
        <datalist id="lstInstitutions">
          <option v-for="name in institutions" :key="name" :value="name"></option>
        </datalist>
      </div>
      <div class="form-group">
        <label for="txtEmail">Email</label>
        <input
          id="txtEmail"
          v-model="expert.email"
          type="email"
          class="form-control form-control-lg"
          placeholder="escreve email"
          required
        />
      </div>
      <div class="form-group">
        <label for="txtWebsite">Website (página institucional ou ORCID)</label>
        <input
          id="txtWebsite"
          v-model="expert.website"
          type="url"
          class="form-control form-control-lg"
          placeholder="https://..."
        />
      </div>
      <div class="form-group">
        <label for="txtPhoto">Fotografia (URL da imagem)</label>
        <input
          id="txtPhoto"
          v-model="expert.photo"
          type="url"
          class="form-control form-control-lg"
          placeholder="https://..."
        />
      </div>
      <div class="form-group">
        <label for="txtBio">Biografia</label>
        <textarea
          id="txtBio"
          v-model="expert.bio"
          class="form-control form-control-lg"
          placeholder="escreve biografia"
          rows="4"
        ></textarea>
      </div>
    </fieldset>

    <fieldset class="mb-4">
      <legend>Associações</legend>
      <p class="text-muted">É obrigatório escolher pelo menos um grupo ou um animal.</p>
      <fieldset class="mb-3">
        <legend class="h6">Grupos taxonómicos</legend>
        <div v-for="group in groups" :key="group.value" class="custom-control custom-checkbox custom-control-inline">
          <input
            :id="'chkGroup-' + group.value"
            v-model="expert.specialization.groups"
            type="checkbox"
            class="custom-control-input"
            :value="group.value"
          />
          <label class="custom-control-label" :for="'chkGroup-' + group.value">{{group.label}}</label>
        </div>
      </fieldset>
      <AnimalPicker
        v-model="expert.specialization.animals"
        :animals="animals"
        label="Animais específicos"
      />
    </fieldset>

    <slot></slot>
  </form>
</template>

<script>
import AnimalPicker from "@/components/AnimalPicker.vue";

export default {
  name: "ExpertForm",
  components: { AnimalPicker },
  // `expert` é o rascunho do pai (mutado por v-model); `animals` a lista completa
  props: {
    expert: { type: Object, required: true },
    animals: { type: Array, default: () => [] },
    institutions: { type: Array, default: () => [] }
  },
  data() {
    return {
      groups: [
        { value: "anfibio", label: "Anfíbio" },
        { value: "ave", label: "Ave" },
        { value: "mamifero", label: "Mamífero" },
        { value: "peixe", label: "Peixe" },
        { value: "reptil", label: "Réptil" }
      ]
    };
  }
};
</script>
