<template>
  <section class="page-section" aria-labelledby="titulo-add-sponsor">
    <b-container>
      <HeaderPage title="Adicionar Patrocinador" titleId="titulo-add-sponsor" />
      <b-row>
        <b-col md="2" class="d-none d-md-block"></b-col>
        <b-col>
          <SponsorForm :sponsor="sponsor" :animals="animals" @submit="add">
            <button type="submit" class="btn btn-outline-success btn-lg mr-2">
              <i class="fas fa-plus-square" aria-hidden="true"></i> ADICIONAR
            </button>
            <router-link
              :to="{name: 'listSponsors'}"
              tag="button"
              class="btn btn-outline-danger btn-lg"
            >
              <i class="fas fa-window-close" aria-hidden="true"></i> CANCELAR
            </router-link>
          </SponsorForm>
        </b-col>
        <b-col md="2" class="d-none d-md-block"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { ADD_SPONSOR } from "@/store/sponsors/sponsor.constants";
import { FETCH_ANIMALS } from "@/store/animals/animal.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import SponsorForm from "@/components/SponsorForm.vue";
import { mapGetters } from "vuex";

export default {
  name: "AddSponsor",
  components: { HeaderPage, SponsorForm },
  data: () => {
    return {
      sponsor: {
        name: "",
        type: "",
        email: "",
        website: "",
        logo: "",
        description: "",
        since: "",
        animals: []
      }
    };
  },
  computed: {
    ...mapGetters("animal", ["getAnimals"]),
    ...mapGetters("sponsor", ["getMessage"]),
    animals() {
      return this.getAnimals;
    }
  },
  methods: {
    add() {
      this.$store.dispatch(`sponsor/${ADD_SPONSOR}`, this.sponsor).then(
        () => {
          this.$alert(this.getMessage, "Patrocinador adicionado!", "success");
          this.$router.push({ name: "listSponsors" });
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    }
  },
  created() {
    this.$store.dispatch(`animal/${FETCH_ANIMALS}`).catch(err => {
      this.$alert(`${err.message}`, "Erro", "error");
    });
  }
};
</script>
