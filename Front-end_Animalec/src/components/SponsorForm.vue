<template>
  <form @submit.prevent="$emit('submit')">
    <fieldset class="mb-4">
      <legend>Dados de identificação</legend>
      <div class="form-group">
        <label for="txtName">Nome</label>
        <input
          id="txtName"
          v-model="sponsor.name"
          type="text"
          class="form-control form-control-lg"
          placeholder="escreve nome"
          required
        />
      </div>
      <div class="form-group">
        <label for="sltType">Tipo</label>
        <select id="sltType" v-model="sponsor.type" class="form-control form-control-lg">
          <option value>-- SELECIONA TIPO --</option>
          <option value="empresa">EMPRESA</option>
          <option value="instituicao">INSTITUIÇÃO</option>
          <option value="particular">PARTICULAR</option>
        </select>
      </div>
      <div class="form-group">
        <label for="txtEmail">Email</label>
        <input
          id="txtEmail"
          v-model="sponsor.email"
          type="email"
          class="form-control form-control-lg"
          placeholder="escreve email"
          required
        />
      </div>
      <div class="form-group">
        <label for="txtWebsite">Website</label>
        <input
          id="txtWebsite"
          v-model="sponsor.website"
          type="url"
          class="form-control form-control-lg"
          placeholder="https://..."
        />
      </div>
      <div class="form-group">
        <label for="txtLogo">Logótipo (URL da imagem)</label>
        <input
          id="txtLogo"
          v-model="sponsor.logo"
          type="url"
          class="form-control form-control-lg"
          placeholder="https://..."
        />
      </div>
      <div class="form-group">
        <label for="txtDescription">Descrição</label>
        <textarea
          id="txtDescription"
          v-model="sponsor.description"
          class="form-control form-control-lg"
          placeholder="escreve descrição"
          rows="4"
        ></textarea>
      </div>
      <div class="form-group">
        <label for="datSince">Patrocinador desde</label>
        <input id="datSince" v-model="sponsor.since" type="date" class="form-control form-control-lg" />
      </div>
    </fieldset>

    <fieldset class="mb-4">
      <legend>Associações</legend>
      <AnimalPicker v-model="sponsor.animals" :animals="animals" label="Animais patrocinados" />
    </fieldset>

    <slot></slot>
  </form>
</template>

<script>
import AnimalPicker from "@/components/AnimalPicker.vue";

export default {
  name: "SponsorForm",
  components: { AnimalPicker },
  // `sponsor` é o rascunho do pai (mutado por v-model); `animals` a lista completa
  props: {
    sponsor: { type: Object, required: true },
    animals: { type: Array, default: () => [] }
  }
};
</script>
