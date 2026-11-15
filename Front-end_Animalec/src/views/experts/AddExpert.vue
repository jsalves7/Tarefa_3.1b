<template>
  <section class="page-section" aria-labelledby="titulo-add-expert">
    <b-container>
      <HeaderPage title="Adicionar Especialista" titleId="titulo-add-expert" />
      <b-row>
        <b-col cols="2"></b-col>
        <b-col>
          <ExpertForm :expert="expert" :animals="animals" :institutions="institutions" @submit="add">
            <button type="submit" class="btn btn-outline-success btn-lg mr-2">
              <i class="fas fa-plus-square" aria-hidden="true"></i> ADICIONAR
            </button>
            <router-link
              :to="{name: 'listExperts'}"
              tag="button"
              class="btn btn-outline-danger btn-lg"
            >
              <i class="fas fa-window-close" aria-hidden="true"></i> CANCELAR
            </router-link>
          </ExpertForm>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { ADD_EXPERT, FETCH_EXPERTS } from "@/store/experts/expert.constants";
import { FETCH_ANIMALS } from "@/store/animals/animal.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import ExpertForm from "@/components/ExpertForm.vue";
import { mapGetters } from "vuex";

export default {
  name: "AddExpert",
  components: { HeaderPage, ExpertForm },
  data: () => {
    return {
      expert: {
        name: "",
        title: "",
        institution: "",
        email: "",
        website: "",
        photo: "",
        bio: "",
        specialization: { groups: [], animals: [] }
      }
    };
  },
  computed: {
    ...mapGetters("animal", ["getAnimals"]),
    ...mapGetters("expert", ["getExperts", "getMessage"]),
    animals() {
      return this.getAnimals;
    },
    // Sugestões: instituições já registadas (o datalist só sugere, não valida)
    institutions() {
      return [...new Set(this.getExperts.map(e => e.institution).filter(Boolean))];
    }
  },
  methods: {
    add() {
      this.$store.dispatch(`expert/${ADD_EXPERT}`, this.expert).then(
        () => {
          this.$alert(this.getMessage, "Especialista adicionado!", "success");
          this.$router.push({ name: "listExperts" });
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    }
  },
  created() {
    Promise.all([
      this.$store.dispatch(`animal/${FETCH_ANIMALS}`),
      this.$store.dispatch(`expert/${FETCH_EXPERTS}`)
    ]).catch(err => {
      this.$alert(`${err.message}`, "Erro", "error");
    });
  }
};
</script>
